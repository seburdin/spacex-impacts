import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate satellite positions for visualization
// Starlink satellites orbit at ~550km altitude in multiple orbital shells
export function generateSatellitePositions(count: number = 6900) {
  const satellites: Array<{
    id: number
    location: [number, number]
    size: number
    altitude: number
    inclination: number
    shell: number
  }> = []

  // Starlink constellation uses multiple orbital shells
  const shells = [
    { altitude: 550, inclination: 53, count: 4400 },  // Shell 1
    { altitude: 540, inclination: 53.2, count: 1600 }, // Shell 2
    { altitude: 570, inclination: 70, count: 700 },   // Shell 3
    { altitude: 560, inclination: 97.6, count: 200 },  // Polar
  ]

  let id = 0
  shells.forEach(shell => {
    const satsInShell = Math.floor((shell.count / 6900) * count)

    for (let i = 0; i < satsInShell; i++) {
      // Distribute satellites evenly around the orbital plane
      const longitude = (i / satsInShell) * 360 - 180
      const latitude = (Math.random() - 0.5) * shell.inclination * 2

      satellites.push({
        id: id++,
        location: [latitude, longitude],
        size: 0.01,
        altitude: shell.altitude,
        inclination: shell.inclination,
        shell: shells.indexOf(shell) + 1
      })
    }
  })

  return satellites
}

// Convert lat/lng to 3D coordinates for globe
export function latLngToVector3(lat: number, lng: number, radius: number = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  }
}

// Calculate distance between two coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Format large numbers
export function formatNumber(num: number | string): string {
  if (typeof num === 'string') {
    return num
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
