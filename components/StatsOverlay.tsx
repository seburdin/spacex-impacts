"use client"

import { motion } from 'framer-motion'
import { Satellite, Globe, Users, Zap } from 'lucide-react'
import { ViewMode } from './Globe'

interface StatsOverlayProps {
  mode: ViewMode
}

export default function StatsOverlay({ mode }: StatsOverlayProps) {
  const stats = [
    {
      icon: Satellite,
      label: 'Satellites',
      value: '6,900+',
      subtext: 'In orbit',
      color: 'text-purple-400'
    },
    {
      icon: Globe,
      label: 'Countries',
      value: '150+',
      subtext: 'Worldwide',
      color: 'text-cyan-400'
    },
    {
      icon: Users,
      label: 'Customers',
      value: '4.6M',
      subtext: 'Globally',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      label: 'Capacity',
      value: '350 Tbps',
      subtext: 'Network',
      color: 'text-yellow-400'
    }
  ]

  return (
    <div className="fixed top-3 left-3 sm:top-6 sm:left-6 z-30 max-w-[calc(100vw-1.5rem)] sm:max-w-none">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-slate-700 p-3 sm:p-6 shadow-2xl"
      >
        {/* Title */}
        <div className="mb-3 sm:mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-white mb-1">
            Starlink Impact
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
            Connecting the world, one satellite at a time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-700/50"
            >
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 ${stat.color}`} />
              <div className="text-white text-base sm:text-xl font-bold">{stat.value}</div>
              <div className="text-slate-400 text-[10px] sm:text-xs">{stat.label}</div>
              <div className="text-slate-500 text-[10px] sm:text-xs hidden sm:block">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>

        {/* Mode indicator */}
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400 text-[10px] sm:text-xs">
              {mode === 'countries' && 'Viewing Coverage'}
              {mode === 'satellites' && 'Viewing Constellation'}
              {mode === 'stories' && 'Viewing Impact Stories'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
