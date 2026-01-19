'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Asset, Diagram } from '@/types'
import { DiagramCanvas } from './DiagramCanvas'
import { AssetTable } from './AssetTable'
import { Button } from './ui/Button'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface ReviewWorkbenchProps {
  diagramId: string
}

export function ReviewWorkbench({ diagramId }: ReviewWorkbenchProps) {
  const router = useRouter()
  const supabase = createClient()
  const [diagram, setDiagram] = useState<Diagram | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
 
  useEffect(() => {
    loadDiagramData()
  }, [diagramId])

  const loadDiagramData = async () => {
    try {
      setLoading(true)

      const { data: diagramData, error: diagramError } = await supabase
        .from('diagrams')
        .select('*')
        .eq('id', diagramId)
        .single()

      if (diagramError) throw diagramError
      setDiagram(diagramData)

      const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('diagram_id', diagramId)
        .order('created_at', { ascending: true })

      if (assetsError) throw assetsError
      setAssets(assetsData || [])

    } catch (error) {
      console.log(diagramId)
      console.error('Load error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{diagram?.filename}</h1>
            <p className="text-slate-400 mt-1">
              Review and verify {assets.length} extracted assets
            </p>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        <DiagramCanvas
          diagram={diagram}
          assets={assets}
          selectedAsset={selectedAsset}
          zoom={zoom}
        />
        
        <AssetTable
          assets={assets}
        />
      </div>
    </div>
  )
}