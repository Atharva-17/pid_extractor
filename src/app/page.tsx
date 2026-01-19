import { Dashboard } from '@/components/Dashboard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">P&ID Asset Extractor</h1>
          <p className="text-slate-400">Transform static diagrams into live, searchable digital assets</p>
        </div>
        <Dashboard />
      </div>
    </div>
  )
}