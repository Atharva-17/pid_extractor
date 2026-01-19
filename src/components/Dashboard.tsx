'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Check, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Alert } from './ui/Alert'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface UploadItem {
  id: string
  name: string
  status: 'uploading' | 'extracting' | 'completed' | 'error'
  file: File
  diagramId?: string
  error?: string
}

export function Dashboard() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || 'anonymous')
    })
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      await processFiles(files)
    }
  }


const processFiles = async (files: File[]) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
  const validFiles = files.filter(f => validTypes.includes(f.type))

  if (validFiles.length === 0) {
    setError('Please upload PNG, JPG, or PDF files only')
    return
  }

  setError(null)

  for (const file of validFiles) {
    const uploadId = crypto.randomUUID()

    setUploads(prev => [
      ...prev,
      {
        id: uploadId,
        name: file.name,
        status: 'uploading',
        file
      }
    ])

    try {
      /* ========================
         1️⃣ UPLOAD (UNCHANGED)
      ======================== */
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const err = await uploadResponse.json()
        throw new Error(err.error || 'Upload failed')
      }

      const { diagramId } = await uploadResponse.json()

      // 🔹 move to extracting
      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId
            ? { ...u, status: 'extracting', diagramId }
            : u
        )
      )

const arrayBuffer = await file.arrayBuffer()
const base64 = Buffer.from(arrayBuffer).toString('base64')

const extractResponse = await fetch('/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    base64,
    mimeType: file.type, // application/pdf
    diagramId
  })
})

if (!extractResponse.ok) {
  const err = await extractResponse.json()
  throw new Error(err.error || 'Extraction failed')
}

      /* ========================
         4️⃣ DONE (UNCHANGED)
      ======================== */
      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId
            ? { ...u, status: 'completed' }
            : u
        )
      )

    } catch (err) {
      console.error('Processing error:', err)

      setUploads(prev =>
        prev.map(u =>
          u.id === uploadId
            ? {
                ...u,
                status: 'error',
                error: err instanceof Error ? err.message : 'Upload failed'
              }
            : u
        )
      )
    }
  }
}


  return (
    <div className="space-y-8">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-105' 
            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Drop P&ID diagrams here
        </h3>
        <p className="text-slate-400 mb-4">
          Supports PNG, JPG, and single-page PDF files
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          Choose Files
        </Button>
      </div>

      {/* Upload List */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">
            Recent Uploads ({uploads.length})
          </h2>
          {uploads.map(upload => (
            <Card key={upload.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{upload.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-400 capitalize">{upload.status}</p>
                    {upload.error && (
                      <span className="text-xs text-red-400 truncate">- {upload.error}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {upload.status === 'uploading' && <LoadingSpinner size="sm" />}
                {upload.status === 'extracting' && <LoadingSpinner size="sm" variant="warning" />}
                {upload.status === 'completed' && (
                  <>
                    <Check className="w-5 h-5 text-green-400" />
                    {upload.diagramId && (
                      <Button
                        size="sm"
                        onClick={() => router.push(`/review/${upload.diagramId}`)}
                      >
                        Review
                      </Button>
                    )}
                  </>
                )}
                {upload.status === 'error' && <X className="w-5 h-5 text-red-400" />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}