// Data type definitions for the application

export interface Country {
  name: string
  code: string
  coordinates: [number, number]
  launchDate: string
  subscribers: string
  coverage: string
  status: string
}

export interface ImpactStory {
  id: number
  title: string
  description: string
  category: string
  peopleImpacted: string
  location: string
  coordinates: [number, number]
  cost: string
  storyLink: string
  color: string
}

// Union type for data that can be either Country or ImpactStory
export type MarkerData = Country | ImpactStory
