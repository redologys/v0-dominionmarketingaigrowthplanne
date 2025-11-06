export interface ScoreBreakdown {
  area: string
  feedback: string
  score: number
  tenScale?: number // Added tenScale field for 1-10 rating
}

export interface FirmographicData {
  legalName?: string
  registrationStatus?: string
  jurisdiction?: string
  companyType?: string
  isVerified: boolean
}

export interface LocalListingData {
  address?: string
  rating?: number
  reviewCount?: number
  phone?: string
  categories?: string[]
  isListed: boolean
}

export interface YelpData {
  rating?: number
  reviewCount?: number
  categories?: string[]
  isListed: boolean
}

export interface GoogleBusinessData {
  rating?: number
  reviewCount?: number
  isListed: boolean
}

export interface SocialMediaData {
  instagram?: string
  facebook?: string
  twitter?: string
  youtube?: string
  instagramFollowers?: number
  hasSocialPresence: boolean
}

export interface ScoreResult {
  overallScore: number
  percentile?: number // Added percentile field
  label: string
  breakdown: ScoreBreakdown[]
  recommendations?: string[]
  categoryRatings?: {
    performance: number
    seo: number
    accessibility: number
    reputation: number
    localVisibility: number
    social?: number
  } // Added categoryRatings for normalized 1-10 scores
  firmographicData?: FirmographicData
  localListingData?: LocalListingData
  yelpData?: YelpData // Added Yelp data
  googleBusinessData?: GoogleBusinessData // Added Google Business data
  socialMediaData?: SocialMediaData // Added social media data
  rawData?: PresenceCheckResponse
  source?: string // Added source field
  usedFallback?: boolean // Added fallback indicator
}

export interface PresenceCheckResponse {
  businessName: string
  websiteURL: string
  performance: number
  seo: number
  techDepth: number
  visibility: number
  totalScore: number
  insights: string[]
}

export interface SocialMediaHandles {
  instagram?: string
  tiktok?: string
  facebook?: string
  linkedin?: string
}

export interface SocialMediaAnalysis {
  platform: string
  handle: string
  score: number
  metrics: {
    followers?: number
    engagement?: number
    postsPerWeek?: number
    brandConsistency?: number
  }
  feedback: string
}

export interface SocialScoreResult {
  overallScore: number
  label: string
  breakdown: SocialMediaAnalysis[]
  summary: string
  recommendations?: string[]
  mode: "social"
}

export interface WebsiteScoreResult extends ScoreResult {
  mode: "website"
}

export type AnalysisResult = WebsiteScoreResult | SocialScoreResult
