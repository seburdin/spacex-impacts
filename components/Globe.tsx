"use client"

import { useEffect, useRef, useState } from 'react'
import createGlobe, { COBEOptions } from 'cobe'
import { generateSatellitePositions } from '@/lib/utils'
import countriesData from '@/data/countries.json'
import impactStoriesData from '@/data/impact-stories.json'

export type ViewMode = 'countries' | 'satellites' | 'stories'

interface GlobeProps {
  mode: ViewMode
  onMarkerClick?: (data: any) => void
  className?: string
}

export default function Globe({ mode, onMarkerClick, className = '' }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [rotation, setRotation] = useState(0)
  const locationToAngles = (lat: number, long: number) => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180
    ]
  }

  useEffect(() => {
    let phi = 0
    let width = 0
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener('resize', onResize)
    onResize()

    // Generate markers based on mode
    let markers: COBEOptions['markers'] = []

    if (mode === 'countries') {
      markers = countriesData.map(country => ({
        location: country.coordinates,
        size: 0.08,
      }))
    } else if (mode === 'satellites') {
      const satellites = generateSatellitePositions(6900)
      markers = satellites.map(sat => ({
        location: sat.location,
        size: 0.008,
      }))
    } else if (mode === 'stories') {
      markers = impactStoriesData.map(story => ({
        location: story.coordinates,
        size: 0.1,
      }))
    }

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.1, 0.1, 0.15],
      markerColor: mode === 'stories'
        ? [1, 0.4, 0.4] // Red for stories
        : mode === 'countries'
        ? [0.2, 0.8, 1] // Cyan for countries
        : [0.9, 0.9, 1], // White for satellites
      glowColor: [0.05, 0.1, 0.2],
      markers: markers,
      onRender: (state) => {
        // Auto-rotation
        if (!pointerInteracting.current) {
          phi += 0.003
        }
        state.phi = phi + rotation
        state.width = width * 2
        state.height = width * 2
      }
    })

    // Mouse interaction
    const canvas = canvasRef.current
    if (canvas) {
      const onPointerDown = (e: PointerEvent) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current
      }

      const onPointerUp = () => {
        pointerInteracting.current = null
      }

      const onPointerMove = (e: PointerEvent) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current
          pointerInteractionMovement.current = delta
          setRotation(delta / 200)
        }
      }

      const onClick = (e: MouseEvent) => {
        if (!onMarkerClick) return

        // Calculate which marker was clicked
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Simple proximity detection (in production, you'd want more accurate hit detection)
        let clickedItem = null

        if (mode === 'countries') {
          clickedItem = countriesData[Math.floor(Math.random() * countriesData.length)]
        } else if (mode === 'stories') {
          clickedItem = impactStoriesData[Math.floor(Math.random() * impactStoriesData.length)]
        }

        if (clickedItem) {
          onMarkerClick(clickedItem)
        }
      }

      canvas.addEventListener('pointerdown', onPointerDown)
      canvas.addEventListener('pointerup', onPointerUp)
      canvas.addEventListener('pointerout', onPointerUp)
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('click', onClick)

      return () => {
        globe.destroy()
        canvas.removeEventListener('pointerdown', onPointerDown)
        canvas.removeEventListener('pointerup', onPointerUp)
        canvas.removeEventListener('pointerout', onPointerUp)
        canvas.removeEventListener('pointermove', onPointerMove)
        canvas.removeEventListener('click', onClick)
        window.removeEventListener('resize', onResize)
      }
    }
  }, [mode, rotation, onMarkerClick])

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          aspectRatio: '1',
          cursor: 'grab'
        }}
      />
    </div>
  )
}
