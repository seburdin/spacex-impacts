"use client"

import { useState } from 'react'
import Globe, { ViewMode } from '@/components/Globe'
import SidePanel from '@/components/SidePanel'
import ModeSelector from '@/components/ModeSelector'
import StatsOverlay from '@/components/StatsOverlay'
import { MarkerData } from '@/lib/types'

export default function Home() {
  const [mode, setMode] = useState<ViewMode>('countries')
  const [selectedData, setSelectedData] = useState<MarkerData | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  const handleMarkerClick = (data: MarkerData) => {
    setSelectedData(data)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode)
    setIsPanelOpen(false)
    setSelectedData(null)
  }

  return (
    <main className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Stats Overlay */}
      <StatsOverlay mode={mode} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full p-6 pt-8">
        {/* Mode Selector */}
        <div className="w-full flex justify-center mb-8 flex-shrink-0">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
        </div>

        {/* Globe */}
        <div className="flex-1 w-full max-w-5xl mx-auto flex items-center justify-center min-h-0">
          <Globe
            mode={mode}
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
            autoRotate={autoRotate}
          />
        </div>

        {/* Instructions and Controls */}
        <div className="mt-6 text-center flex-shrink-0">
          <div className="flex items-center justify-center gap-6">
            <p className="text-slate-400 text-sm">
              Click and drag to rotate • Click markers to view details
            </p>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200 flex items-center gap-2"
            >
              {autoRotate ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="14" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Pause Rotation
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Resume Rotation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        data={selectedData}
        mode={mode}
      />

      {/* CSS for animated stars */}
      <style jsx>{`
        .stars, .stars2, .stars3 {
          position: absolute;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${generateStarField(200)};
          animation: animStar 50s linear infinite;
        }

        .stars2 {
          width: 2px;
          height: 2px;
          box-shadow: ${generateStarField(100)};
          animation: animStar 100s linear infinite;
        }

        .stars3 {
          width: 3px;
          height: 3px;
          box-shadow: ${generateStarField(50)};
          animation: animStar 150s linear infinite;
        }

        @keyframes animStar {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }
      `}</style>
    </main>
  )
}

// Helper function to generate random star field
function generateStarField(count: number): string {
  let stars = ''
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000)
    const y = Math.floor(Math.random() * 2000)
    stars += `${x}px ${y}px #FFF${i < count - 1 ? ', ' : ''}`
  }
  return stars
}
