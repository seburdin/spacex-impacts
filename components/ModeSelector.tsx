"use client"

import { motion } from 'framer-motion'
import { Globe as GlobeIcon, Satellite, Heart } from 'lucide-react'
import { ViewMode } from './Globe'

interface ModeSelectorProps {
  currentMode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes = [
    {
      id: 'countries' as ViewMode,
      label: 'Coverage',
      icon: GlobeIcon,
      description: 'Countries with Starlink service',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'satellites' as ViewMode,
      label: 'Constellation',
      icon: Satellite,
      description: '~6,900 satellites in orbit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'stories' as ViewMode,
      label: 'Impact Stories',
      icon: Heart,
      description: 'Making a difference worldwide',
      color: 'from-red-500 to-orange-500'
    }
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-4xl px-3 sm:px-0">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id
        const Icon = mode.icon

        return (
          <motion.button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative flex-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all
              ${isActive
                ? 'border-white bg-white/10 shadow-xl'
                : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
              }
            `}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeMode"
                className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${mode.color} opacity-20`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {/* Icon */}
              <div className={`
                p-2 sm:p-3 rounded-lg sm:rounded-xl
                ${isActive
                  ? `bg-gradient-to-br ${mode.color}`
                  : 'bg-slate-700/50'
                }
              `}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </div>

              {/* Text */}
              <div className="text-left flex-1">
                <div className={`font-bold text-base sm:text-lg ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {mode.label}
                </div>
                <div className={`text-xs sm:text-sm ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {mode.description}
                </div>
              </div>

              {/* Active badge */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-white text-xs font-semibold"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Active
                </motion.div>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
