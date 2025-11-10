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
    <div className="fixed top-6 left-6 z-30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 shadow-2xl"
      >
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            Starlink Impact
          </h1>
          <p className="text-slate-400 text-sm">
            Connecting the world, one satellite at a time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50"
            >
              <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
              <div className="text-white text-xl font-bold">{stat.value}</div>
              <div className="text-slate-400 text-xs">{stat.label}</div>
              <div className="text-slate-500 text-xs">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>

        {/* Mode indicator */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400 text-xs">
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
