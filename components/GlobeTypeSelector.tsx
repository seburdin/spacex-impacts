"use client"

import { motion } from 'framer-motion'

export type GlobeType = 'cobe' | 'mapbox'

interface GlobeTypeSelectorProps {
  currentType: GlobeType
  onTypeChange: (type: GlobeType) => void
}

export default function GlobeTypeSelector({ currentType, onTypeChange }: GlobeTypeSelectorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
      <span className="text-slate-400 text-xs sm:text-sm font-medium">Globe Style:</span>
      <div className="flex gap-1 p-1 bg-slate-900/50 rounded-lg">
        <button
          onClick={() => onTypeChange('cobe')}
          className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
            currentType === 'cobe'
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          {currentType === 'cobe' && (
            <motion.div
              layoutId="activeGlobeType"
              className="absolute inset-0 bg-cyan-500/20 border border-cyan-500/50 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">Abstract</span>
        </button>
        <button
          onClick={() => onTypeChange('mapbox')}
          className={`relative px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
            currentType === 'mapbox'
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          {currentType === 'mapbox' && (
            <motion.div
              layoutId="activeGlobeType"
              className="absolute inset-0 bg-cyan-500/20 border border-cyan-500/50 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">Satellite</span>
        </button>
      </div>
    </div>
  )
}
