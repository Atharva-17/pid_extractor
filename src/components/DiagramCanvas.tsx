'use client'

import { useEffect, useRef, useState } from 'react'
import type { Asset, Diagram } from '@/types'
import { Card } from './ui/Card'

interface DiagramCanvasProps {
  diagram: Diagram | null
  assets: Asset[]
  selectedAsset: Asset | null
  zoom: number
}

export function DiagramCanvas({ diagram, assets, selectedAsset, zoom }: DiagramCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isPdf, setIsPdf] = useState(false)

  useEffect(() => {
    if (diagram?.public_url) {
      setImageUrl(diagram.public_url)
      const filename = diagram.filename?.toLowerCase() || ''
      setIsPdf(filename.endsWith('.pdf'))
    }
  }, [diagram])

  useEffect(() => {
    if (imageUrl && !isPdf && imageRef.current?.complete) {
      drawCanvas()
    }
  }, [imageUrl, selectedAsset, assets, isPdf])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const img = imageRef.current
    
    if (!canvas || !img || !img.complete) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)

    // Draw all assets (faded)
    assets.forEach(asset => {
      const [x, y] = asset.coordinates
      const px = x * canvas.width
      const py = y * canvas.height

      ctx.strokeStyle = asset.verified ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(px, py, 25, 0, 2 * Math.PI)
      ctx.stroke()
    })

    // Draw selected asset (bright)
    if (selectedAsset) {
      const [x, y] = selectedAsset.coordinates
      const px = x * canvas.width
      const py = y * canvas.height

      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(px, py, 35, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(px, py, 25, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(px, py, 4, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)'
      ctx.font = 'bold 14px sans-serif'
      const textWidth = ctx.measureText(selectedAsset.tag).width
      ctx.fillRect(px + 40, py - 15, textWidth + 12, 24)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(selectedAsset.tag, px + 46, py + 3)
    }
  }

  return (
    <Card className="h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-shrink-0 pb-2 mb-2 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">P&ID Diagram</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div 
          className="flex items-start justify-center min-h-full p-4"
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'top center'
          }}
        >
          {imageUrl && isPdf ? (
            <iframe
              ref={iframeRef}
              src={imageUrl}
              className="w-full h-[calc(100vh-300px)] border border-slate-700 rounded-lg bg-white"
              title="P&ID Diagram PDF"
            />
          ) : imageUrl && !isPdf ? (
            <>
              <img
                ref={imageRef}
                src={imageUrl}
                alt="P&ID Diagram"
                className="hidden"
                onLoad={drawCanvas}
                crossOrigin="anonymous"
              />
              <canvas
                ref={canvasRef}
                className="border border-slate-700 rounded shadow-lg max-w-full"
              />
            </>
          ) : (
            <div className="text-slate-400 text-center py-12">
              No diagram available
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}