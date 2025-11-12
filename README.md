# Starlink Impact Visualization

An elegant, inspiring 3D visualization showcasing Starlink's global deployment and positive impact on communities worldwide. Built with Next.js, React, with dual globe rendering options for stunning interactive experiences.

## Features

### Two Globe Visualization Options

**Abstract Globe (COBE)** - Clean, minimalist WebGL-based visualization
- Lightweight (only 5kB!)
- Smooth performance with thousands of markers
- Perfect for quick overview and elegant presentation

**Satellite Globe (Mapbox)** - Photorealistic Earth with satellite imagery
- High-resolution satellite imagery from Mapbox
- 3D globe projection with realistic textures
- Atmospheric effects and space background
- Similar look and feel to professional satellite trackers

Switch between visualizations instantly using the "Globe Style" toggle.

### Three Interactive Modes

1. **Coverage Mode** - View countries where Starlink is available
   - 150+ countries highlighted on the globe
   - Click any country to see deployment details, subscriber counts, and launch dates

2. **Constellation Mode** - Visualize the satellite network
   - ~6,900 satellites displayed as orbiting dots
   - Multiple orbital shells represented with real orbital inclinations

3. **Impact Stories Mode** - Inspiring stories of global impact
   - 12 carefully curated impact stories
   - Color-coded by category: Disaster Relief (Red), Education (Blue), Community Support (Green)
   - Detailed information panels with metrics and external links

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Library**: React 19
- **3D Globe Rendering**:
  - **COBE**: Lightweight WebGL-based abstract globe (5kB)
  - **Mapbox GL JS**: Photorealistic satellite imagery globe with 3D projection
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
npm install
```

### Configuration (Optional - For Mapbox Globe)

To use the satellite imagery globe visualization, you'll need a free Mapbox access token:

1. Sign up at [Mapbox](https://account.mapbox.com/)
2. Copy your access token
3. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token_here
```

**Note**: The abstract globe (COBE) works without any configuration. Mapbox token is only needed for the satellite imagery option.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the visualization.

## Key Statistics

- **6,900+ Satellites** in orbit
- **150+ Countries** with service
- **4.6M Customers** globally
- **350 Tbps** network capacity

## Project Structure

```
starlink-impact-viz/
├── app/                      # Next.js pages
├── components/               # React components
│   ├── Globe.tsx            # COBE 3D rotating globe
│   ├── MapboxGlobe.tsx      # Mapbox satellite globe
│   ├── GlobeTypeSelector.tsx # Globe style toggle
│   ├── SidePanel.tsx        # Info display
│   ├── ModeSelector.tsx     # Mode switching
│   └── StatsOverlay.tsx     # Statistics
├── data/                    # JSON data files
└── lib/                     # Utilities
```

## Featured Impact Stories

- Ukraine War Connectivity Support (150,000+ daily users)
- Hurricane Ian Florida Response
- Chile & Brazil Schools via Polaris
- Maui Hawaii Wildfire Recovery
- Philippines Typhoon Response
- South Africa Rural Schools Initiative
- And more...

## Data Sources

- Starlink Progress Report 2024
- Official Starlink stories from starlink.com
- Verified impact data from news sources

## Deployment

This project uses a **Docker-based deployment strategy** for optimized, production-ready deployments.

### 🐳 Docker Deployment (Production)

Pre-built Docker images are automatically created in GitHub Actions and deployed to Railway:

**Benefits:**
- ⚡ **Fast deployments** - 30 seconds vs 3-5 minutes
- 💰 **Lower costs** - Reduced Railway resource usage
- ✅ **Reliability** - Same tested image in CI and production
- 🔒 **Security** - Multi-stage builds with non-root user

**How it works:**
1. Push to `main` → GitHub Actions builds Docker image
2. Image pushed to GitHub Container Registry (GHCR)
3. Railway pulls and deploys pre-built image
4. Health checks verify successful deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

### 📚 Documentation

- **Docker Deployment:** [DOCKER-DEPLOYMENT.md](./DOCKER-DEPLOYMENT.md)
- **Full Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Workflows:** [.github/workflows/README.md](./.github/workflows/README.md)

### Build Locally

```bash
npm run build
npm start
```

## Credits

- **Inspiration**: StarPlex by JerryWu0430
- **Globe**: Cobe by shuding
- **Data**: SpaceX Starlink official reports

Built with inspiration and powered by innovation 🚀🌍
