# Starlink Impact Visualization

An elegant, inspiring 3D visualization showcasing Starlink's global deployment and positive impact on communities worldwide. Built with Next.js, React, and Cobe for a stunning interactive globe experience.

## Features

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
- **3D Globe**: Cobe (WebGL-based, only 5kB!)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
npm install
```

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
├── app/                  # Next.js pages
├── components/           # React components
│   ├── Globe.tsx        # 3D rotating globe
│   ├── SidePanel.tsx    # Info display
│   ├── ModeSelector.tsx # Mode switching
│   └── StatsOverlay.tsx # Statistics
├── data/                # JSON data files
└── lib/                 # Utilities
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

This project is configured for seamless deployment to Railway.app with two approaches:

### Option 1: Railway Native Integration (Recommended)

**Simplest setup** - Just connect your GitHub repository to Railway:

1. Go to [railway.app](https://railway.app) and create a new project
2. Select "Deploy from GitHub repo"
3. Choose this repository
4. Railway automatically deploys on every push to main
5. Optional: Enable PR previews in Railway settings

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**Benefits:** Zero configuration, no secrets needed, automatic deployments

### Option 2: GitHub Actions + Railway CLI (Advanced)

**For complex pipelines** requiring custom checks, deployment gates, or multi-environment setups:

- Automated CI pipeline with linting and building
- Custom deployment logic via GitHub Actions
- Preview deployments for pull requests

**Setup:** See [Deployment Guide](./DEPLOYMENT.md) for GitHub secrets configuration

---

Both approaches use the included `railway.json` and `nixpacks.toml` configuration files for optimized builds.

**Full documentation:** [Deployment Guide](./DEPLOYMENT.md)

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
