"use client"

import { useState } from 'react'
import Globe, { ViewMode } from '@/components/Globe'
import SidePanel from '@/components/SidePanel'
import ModeSelector from '@/components/ModeSelector'
import StatsOverlay from '@/components/StatsOverlay'

export default function Home() {
  const [mode, setMode] = useState<ViewMode>('countries')
  const [selectedData, setSelectedData] = useState<any>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const handleMarkerClick = (data: any) => {
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
        {/* Mode Selector */}
        <div className="mb-8">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
        </div>

        {/* Globe */}
        <div className="flex-1 w-full max-w-5xl flex items-center justify-center">
          <Globe
            mode={mode}
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Click and drag to rotate • Click markers to view details
          </p>
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
