"use client";

import {
  Layers,
  CheckCircle,
  Tag,
  MapPin,
} from "lucide-react";
import type { Asset } from "@/types";
import { Card } from "./ui/Card";

interface AssetTableProps {
  assets: Asset[];
}

export function AssetTable({
  assets,
}: AssetTableProps) {

  return (
    <Card className="h-[calc(100vh-200px)] overflow-auto">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              P&ID Asset Cards
            </h1>
            <p className="text-slate-400">
              Interactive cards for extracted assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Tag className="w-6 h-6 text-blue-400" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {asset.tag}
                      </h3>
                      {asset.verified && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-400">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  {/* Asset Type */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 uppercase tracking-wide">
                        Asset Type
                      </label>
                      <p className="text-white font-medium mt-1">
                        {asset.type}
                      </p>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 uppercase tracking-wide">
                        Coordinates (X, Y)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-slate-700/50 px-3 py-1.5 rounded text-blue-400 font-mono text-sm">
                          {asset.coordinates[0].toFixed(3)}
                        </code>
                        <span className="text-slate-500">,</span>
                        <code className="bg-slate-700/50 px-3 py-1.5 rounded text-blue-400 font-mono text-sm">
                          {asset.coordinates[1].toFixed(3)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
