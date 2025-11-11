"use client"

import { useEffect, useRef, useState } from 'react'
import createGlobe, { COBEOptions } from 'cobe'
import { generateSatellitePositions } from '@/lib/utils'
import countriesData from '@/data/countries.json'
import impactStoriesData from '@/data/impact-stories.json'
import { MarkerData } from '@/lib/types'

export type ViewMode = 'countries' | 'satellites' | 'stories'

interface GlobeProps {
  mode: ViewMode
  onMarkerClick?: (data: MarkerData) => void
  className?: string
  autoRotate?: boolean
}

export default function Globe({ mode, onMarkerClick, className = '', autoRotate = true }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [rotation, setRotation] = useState(0)
  const phiRef = useRef(0) // Track phi for click detection

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
    let markerData: MarkerData[] = []

    if (mode === 'countries') {
      markers = countriesData.map(country => ({
        location: country.coordinates as [number, number],
        size: 0.08,
      }))
      markerData = countriesData as unknown as MarkerData[]
    } else if (mode === 'satellites') {
      const satellites = generateSatellitePositions(6900)
      markers = satellites.map(sat => ({
        location: sat.location,
        size: 0.008,
      }))
    } else if (mode === 'stories') {
      markers = impactStoriesData.map(story => ({
        location: story.coordinates as [number, number],
        size: 0.1,
      }))
      markerData = impactStoriesData as unknown as MarkerData[]
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
        if (!pointerInteracting.current && autoRotate) {
          phi += 0.003
        }
        state.phi = phi + rotation
        phiRef.current = phi + rotation // Store current phi for click detection
        state.width = width * 2
        state.height = width * 2
      }
    })

    // Helper function to convert lat/lng to 3D coordinates
    const latLngToVector3 = (lat: number, lng: number, radius: number = 1) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      return {
        x: -(radius * Math.sin(phi) * Math.cos(theta)),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta)
      }
    }

    // Helper function to rotate point by phi angle
    const rotatePoint = (x: number, z: number, angle: number) => {
      return {
        x: x * Math.cos(angle) - z * Math.sin(angle),
        z: x * Math.sin(angle) + z * Math.cos(angle)
      }
    }

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
        if (!onMarkerClick || mode === 'satellites') return

        // Get click position on canvas
        const rect = canvas.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

        // Convert to 3D sphere coordinates
        const clickRadius = Math.sqrt(x * x + y * y)
        if (clickRadius > 1) return // Click outside globe

        // Calculate z coordinate on sphere
        const z = Math.sqrt(1 - x * x - y * y)

        // Current globe rotation
        const currentPhi = phiRef.current

        let minDistance = Infinity
        let clickedItem: MarkerData | null = null

        // Find nearest marker
        markerData.forEach((item, index) => {
          const marker = markers[index]
          if (!marker) return

          const [lat, lng] = marker.location

          // Convert marker to 3D
          const markerPos = latLngToVector3(lat, lng)

          // Apply globe rotation to marker
          const rotated = rotatePoint(markerPos.x, markerPos.z, -currentPhi)
          markerPos.x = rotated.x
          markerPos.z = rotated.z

          // Calculate distance between click point and marker
          const distance = Math.sqrt(
            Math.pow(x - markerPos.x, 2) +
            Math.pow(y - markerPos.y, 2) +
            Math.pow(z - markerPos.z, 2)
          )

          if (distance < minDistance) {
            minDistance = distance
            clickedItem = item
          }
        })

        // Only trigger if click is close enough to a marker
        const threshold = mode === 'countries' ? 0.25 : 0.3
        if (clickedItem && minDistance < threshold) {
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
  }, [mode, rotation, onMarkerClick, autoRotate])

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
