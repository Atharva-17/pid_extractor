import { ReviewWorkbench } from '@/components/ReviewWorkbench'
import React from 'react'

export default function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <ReviewWorkbench diagramId={id} />
      </div>
    </div>
  )
}