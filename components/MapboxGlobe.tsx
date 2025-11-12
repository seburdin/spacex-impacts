"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { generateSatellitePositions } from '@/lib/utils'
import countriesData from '@/data/countries.json'
import impactStoriesData from '@/data/impact-stories.json'
import { MarkerData } from '@/lib/types'
import { ViewMode } from './Globe'

// You'll need to set your Mapbox access token
// For production, use environment variables
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'

interface MapboxGlobeProps {
  mode: ViewMode
  onMarkerClick?: (data: MarkerData) => void
  className?: string
  autoRotate?: boolean
}

export default function MapboxGlobe({ mode, onMarkerClick, className = '', autoRotate = true }: MapboxGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const rotationInterval = useRef<NodeJS.Timeout | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // Use satellite imagery style for realistic earth view
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: { name: 'globe' },
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      logoPosition: 'bottom-right'
    })

    // Add atmosphere and stars for space-like appearance
    map.current.on('style.load', () => {
      if (!map.current) return

      map.current.setFog({
        color: 'rgb(10, 15, 30)', // Dark space background
        'high-color': 'rgb(25, 35, 60)', // Atmospheric glow
        'horizon-blend': 0.05,
        'space-color': 'rgb(5, 5, 10)', // Space background
        'star-intensity': 0.8
      })

      setIsInitialized(true)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Handle auto-rotation
  useEffect(() => {
    if (!map.current || !isInitialized) return

    if (rotationInterval.current) {
      clearInterval(rotationInterval.current)
      rotationInterval.current = null
    }

    if (autoRotate) {
      let bearing = map.current.getBearing()
      rotationInterval.current = setInterval(() => {
        if (!map.current) return
        bearing -= 0.2 // Rotate speed
        map.current.setBearing(bearing)
      }, 30)
    }

    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current)
      }
    }
  }, [autoRotate, isInitialized])

  // Update markers based on mode
  useEffect(() => {
    if (!map.current || !isInitialized) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    let markerData: { location: [number, number]; data?: MarkerData; color: string; size: number }[] = []

    if (mode === 'countries') {
      markerData = countriesData.map(country => ({
        location: country.coordinates as [number, number],
        data: country as unknown as MarkerData,
        color: '#33CCFF', // Cyan
        size: 20
      }))
    } else if (mode === 'satellites') {
      const satellites = generateSatellitePositions(6900)
      markerData = satellites.map(sat => ({
        location: sat.location,
        color: '#FFFFFF', // White
        size: 4
      }))
    } else if (mode === 'stories') {
      markerData = impactStoriesData.map(story => ({
        location: story.coordinates as [number, number],
        data: story as unknown as MarkerData,
        color: '#FF6666', // Red
        size: 24
      }))
    }

    // Create markers
    markerData.forEach(({ location, data, color, size }) => {
      const [lat, lng] = location

      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'mapbox-marker'
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.backgroundColor = color
      el.style.borderRadius = '50%'
      el.style.border = `2px solid ${color}88`
      el.style.boxShadow = `0 0 ${size/2}px ${color}cc`
      el.style.cursor = data && onMarkerClick ? 'pointer' : 'default'
      el.style.transition = 'all 0.2s ease'

      // Add hover effect for clickable markers
      if (data && onMarkerClick) {
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.5)'
          el.style.zIndex = '1000'
        })
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)'
          el.style.zIndex = '1'
        })
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          onMarkerClick(data)
        })
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!)

      markers.current.push(marker)
    })
  }, [mode, onMarkerClick, isInitialized])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          minHeight: '400px',
          background: 'linear-gradient(to bottom, #0a0f1e, #151a2f)'
        }}
      />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 rounded-lg">
          <div className="text-slate-400 text-sm">Loading globe...</div>
        </div>
      )}

      <style jsx global>{`
        .mapbox-marker {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .mapboxgl-ctrl-logo {
          opacity: 0.5 !important;
        }
      `}</style>
    </div>
  )
}
