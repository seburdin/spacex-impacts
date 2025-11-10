"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Users, MapPin, DollarSign } from 'lucide-react'
import { ViewMode } from './Globe'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  data: any
  mode: ViewMode
}

export default function SidePanel({ isOpen, onClose, data, mode }: SidePanelProps) {
  if (!data) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>

            <div className="p-8">
              {mode === 'countries' && (
                <CountryView data={data} />
              )}
              {mode === 'stories' && (
                <StoryView data={data} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CountryView({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-sm text-cyan-400 font-semibold mb-2">COUNTRY PROFILE</div>
        <h2 className="text-3xl font-bold text-white mb-2">{data.name}</h2>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-4 h-4" />
          <span>{data.code}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-300 font-medium text-sm">{data.status}</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Launch Date</div>
          <div className="text-white text-xl font-bold">{data.launchDate}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Subscribers</div>
          <div className="text-white text-xl font-bold">{data.subscribers}</div>
        </div>
      </div>

      {/* Coverage */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
        <div className="text-cyan-300 font-semibold mb-2">Coverage Area</div>
        <div className="text-white text-lg">{data.coverage}</div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 pt-4 border-t border-slate-700">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
          <div>
            <div className="text-slate-400 text-sm">Impact</div>
            <div className="text-white">Providing high-speed internet connectivity to residential, business, and mobile users</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoryView({ data }: { data: any }) {
  const categoryColors: Record<string, string> = {
    'Disaster Help': 'from-red-500/20 to-orange-500/20 border-red-500/30',
    'Education': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    'Community Support': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  }

  const categoryTextColors: Record<string, string> = {
    'Disaster Help': 'text-red-300',
    'Education': 'text-blue-300',
    'Community Support': 'text-green-300',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className={`text-sm font-semibold mb-2 ${categoryTextColors[data.category] || 'text-slate-400'}`}>
          {data.category.toUpperCase()}
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">{data.title}</h2>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-4 h-4" />
          <span>{data.location}</span>
        </div>
      </div>

      {/* Description */}
      <div className={`bg-gradient-to-br ${categoryColors[data.category] || 'from-slate-800/50 to-slate-700/50'} rounded-xl p-6 border`}>
        <p className="text-white leading-relaxed">{data.description}</p>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-slate-400 text-sm">People Impacted</div>
              <div className="text-white text-xl font-bold">{data.peopleImpacted}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-slate-400 text-sm">Estimated Cost</div>
              <div className="text-white text-lg font-bold">{data.cost}</div>
            </div>
          </div>
        </div>
      </div>

      {/* External Link */}
      {data.storyLink && (
        <a
          href={data.storyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
        >
          <span>Read Full Story</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      )}

      {/* Stats Footer */}
      <div className="pt-4 border-t border-slate-700">
        <div className="text-slate-400 text-sm text-center">
          One of 12 inspiring stories showcasing Starlink&apos;s global impact
        </div>
      </div>
    </div>
  )
}
