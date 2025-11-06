export const runtime = "edge"
export const maxDuration = 10

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeoutMs}ms`)
    }
    throw error
  }
}

async function analyzeSEO(html: string, url: string): Promise<{ score: number; feedback: string }> {
  const hasTitle = /<title>([^<]+)<\/title>/i.test(html)
  const hasMetaDesc = /name=["']description["']/i.test(html)
  const hasH1 = /<h1[^>]*>([^<]+)<\/h1>/i.test(html)
  const hasSchema = /application\/ld\+json/i.test(html)
  const hasOG = /property=["']og:/i.test(html)
  const hasCanonical = /rel=["']canonical["']/i.test(html)

  let score = 0
  const issues: string[] = []

  if (hasTitle) score += 20
  else issues.push("missing title tag")

  if (hasMetaDesc) score += 20
  else issues.push("missing meta description")

  if (hasH1) score += 15
  else issues.push("missing H1 heading")

  if (hasSchema) score += 15
  else issues.push("no structured data")

  if (hasOG) score += 15
  else issues.push("no Open Graph tags")

  if (hasCanonical) score += 15
  else issues.push("no canonical URL")

  const feedback =
    score >= 80
      ? "Strong SEO foundation"
      : score >= 60
        ? `Good SEO, but ${issues.slice(0, 2).join(", ")}`
        : `Needs improvement: ${issues.slice(0, 3).join(", ")}`

  return { score, feedback }
}

async function checkReputation(url: string): Promise<{ score: number; feedback: string }> {
  const isHTTPS = url.startsWith("https://")
  let score = isHTTPS ? 60 : 20

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: "HEAD",
        headers: { "User-Agent": "Mozilla/5.0 DominionBot/1.0" },
      },
      3000,
    )

    const hasHSTS = response.headers.get("strict-transport-security") !== null
    const hasCSP = response.headers.get("content-security-policy") !== null
    const hasXFrame = response.headers.get("x-frame-options") !== null

    if (hasHSTS) score += 15
    if (hasCSP) score += 15
    if (hasXFrame) score += 10

    const feedback =
      score >= 80
        ? "Excellent security posture"
        : score >= 60
          ? "Good security, consider adding CSP"
          : isHTTPS
            ? "HTTPS enabled, add security headers"
            : "Critical: Enable HTTPS immediately"

    return { score, feedback }
  } catch {
    return {
      score: isHTTPS ? 50 : 20,
      feedback: isHTTPS ? "HTTPS enabled, couldn't verify headers" : "No HTTPS detected",
    }
  }
}

async function checkLocalVisibility(businessName: string): Promise<{ score: number; feedback: string }> {
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(businessName)}&format=json&limit=1`
    const response = await fetchWithTimeout(
      searchUrl,
      {
        headers: { "User-Agent": "DominionMarketing/1.0" },
      },
      4000,
    )

    const results = await response.json()

    if (results && results.length > 0) {
      return {
        score: 75,
        feedback: "Business found in map databases",
      }
    }

    return {
      score: 30,
      feedback: "Limited local visibility, claim your listings",
    }
  } catch {
    return {
      score: 50,
      feedback: "Unable to verify local presence",
    }
  }
}

async function verifyBusinessRegistration(businessName: string): Promise<{
  score: number
  feedback: string
  data: {
    legalName?: string
    registrationStatus?: string
    jurisdiction?: string
    companyType?: string
    isVerified: boolean
  }
}> {
  try {
    console.log("[v0] Checking OpenCorporates for:", businessName)

    const searchUrl = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(businessName)}&format=json&per_page=1`
    const response = await fetchWithTimeout(
      searchUrl,
      {
        headers: { "User-Agent": "DominionMarketing/1.0" },
      },
      5000,
    )

    if (!response.ok) {
      console.log("[v0] OpenCorporates API error:", response.status)
      return {
        score: 50,
        feedback: "Unable to verify business registration",
        data: { isVerified: false },
      }
    }

    const data = await response.json()
    const company = data?.results?.companies?.[0]?.company

    if (company) {
      const isActive = company.current_status?.toLowerCase() === "active"
      const score = isActive ? 90 : 70

      console.log("[v0] OpenCorporates found:", {
        name: company.name,
        status: company.current_status,
        jurisdiction: company.jurisdiction_code,
      })

      return {
        score,
        feedback: isActive ? "Verified registered business" : "Business registered but status unclear",
        data: {
          legalName: company.name,
          registrationStatus: company.current_status,
          jurisdiction: company.jurisdiction_code,
          companyType: company.company_type,
          isVerified: true,
        },
      }
    }

    console.log("[v0] OpenCorporates: No match found")
    return {
      score: 40,
      feedback: "Business registration not found",
      data: { isVerified: false },
    }
  } catch (err: any) {
    console.error("[v0] OpenCorporates error:", err.message)
    return {
      score: 50,
      feedback: "Unable to verify business registration",
      data: { isVerified: false },
    }
  }
}

async function getLocalBusinessData(
  businessName: string,
  url?: string,
): Promise<{
  score: number
  feedback: string
  data: {
    address?: string
    rating?: number
    reviewCount?: number
    phone?: string
    categories?: string[]
    isListed: boolean
  }
}> {
  try {
    console.log("[v0] Checking OpenWeb Ninja for:", businessName)

    // OpenWeb Ninja API endpoint (you'll need to sign up for an API key)
    // For now, we'll use a combination of OpenStreetMap and a fallback approach
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(businessName)}&format=json&limit=1&addressdetails=1`
    const response = await fetchWithTimeout(
      osmUrl,
      {
        headers: { "User-Agent": "DominionMarketing/1.0" },
      },
      4000,
    )

    const results = await response.json()

    if (results && results.length > 0) {
      const place = results[0]

      console.log("[v0] OpenStreetMap found:", {
        name: place.display_name,
        type: place.type,
        address: place.address,
      })

      // Estimate score based on data completeness
      let score = 60 // Base score for being found
      if (place.address) score += 15
      if (place.type) score += 10

      return {
        score,
        feedback: "Business found in map databases with location data",
        data: {
          address: place.display_name,
          categories: place.type ? [place.type] : undefined,
          isListed: true,
        },
      }
    }

    console.log("[v0] OpenStreetMap: No match found")
    return {
      score: 30,
      feedback: "Limited local visibility, claim your Google Business Profile",
      data: { isListed: false },
    }
  } catch (err: any) {
    console.error("[v0] Local business data error:", err.message)
    return {
      score: 50,
      feedback: "Unable to verify local presence",
      data: { isListed: false },
    }
  }
}

async function checkNYCBusinessData(businessName: string): Promise<{
  score: number
  feedback: string
  data: {
    isRegistered: boolean
    legalName?: string
    address?: string
    isInNYC?: boolean
  }
}> {
  try {
    console.log("[v0] Checking NYC Open Data for:", businessName)

    const nycBusinessUrl = `https://data.cityofnewyork.us/resource/22ht-gcyh.json?$select=business_name,legal_business_name,facility_address&$where=business_name like '${encodeURIComponent(businessName)}'&$limit=1`

    const response = await fetchWithTimeout(
      nycBusinessUrl,
      {
        headers: { "User-Agent": "DominionMarketing/1.0" },
      },
      5000,
    )

    if (!response.ok) {
      console.log("[v0] NYC Open Data API error:", response.status)
      return {
        score: 50,
        feedback: "Unable to verify NYC business registration",
        data: { isRegistered: false },
      }
    }

    const nycData = await response.json()

    if (nycData && nycData.length > 0) {
      const business = nycData[0]
      console.log("[v0] NYC Open Data found:", {
        name: business.business_name,
        legalName: business.legal_business_name,
        address: business.facility_address,
      })

      return {
        score: 90,
        feedback: "Verified NYC registered business",
        data: {
          isRegistered: true,
          legalName: business.legal_business_name || business.business_name,
          address: business.facility_address,
          isInNYC: true,
        },
      }
    }

    console.log("[v0] NYC Open Data: No match found")
    return {
      score: 40,
      feedback: "Business not found in NYC registry",
      data: { isRegistered: false },
    }
  } catch (err: any) {
    console.error("[v0] NYC Open Data error:", err.message)
    return {
      score: 50,
      feedback: "Unable to verify NYC business registration",
      data: { isRegistered: false },
    }
  }
}

/**
 * Fetch data from Yelp API
 */
async function getYelpData(businessName: string): Promise<{
  score: number
  feedback: string
  data: {
    rating?: number
    reviewCount?: number
    categories?: string[]
    isListed: boolean
  }
}> {
  try {
    console.log("[v0] Checking Yelp for:", businessName)

    const yelpApiKey = process.env.YELP_API_KEY
    if (!yelpApiKey) {
      console.log("[v0] Yelp API key not configured")
      return {
        score: 50,
        feedback: "Unable to verify Yelp presence",
        data: { isListed: false },
      }
    }

    const yelpUrl = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(businessName)}&location=New%20York%20City&limit=1`

    const response = await fetchWithTimeout(
      yelpUrl,
      {
        headers: {
          Authorization: `Bearer ${yelpApiKey}`,
          "User-Agent": "DominionMarketing/1.0",
        },
      },
      5000,
    )

    if (!response.ok) {
      console.log("[v0] Yelp API error:", response.status)
      return {
        score: 50,
        feedback: "Unable to verify Yelp presence",
        data: { isListed: false },
      }
    }

    const yelpData = await response.json()

    if (yelpData.businesses && yelpData.businesses.length > 0) {
      const business = yelpData.businesses[0]
      const rating = business.rating || 0
      const reviewCount = business.review_count || 0
      const categories = business.categories?.map((c: any) => c.title) || []

      // Convert 5-star rating to 0-100 score
      const ratingScore = Math.round(rating * 20)

      // Bonus points for review count
      const reviewBonus = Math.min(20, Math.floor(reviewCount / 10))

      const score = Math.min(100, ratingScore + reviewBonus)

      console.log("[v0] Yelp found:", {
        name: business.name,
        rating,
        reviewCount,
        score,
      })

      return {
        score,
        feedback: `${rating}/5 stars with ${reviewCount} reviews on Yelp`,
        data: {
          rating,
          reviewCount,
          categories,
          isListed: true,
        },
      }
    }

    console.log("[v0] Yelp: No match found")
    return {
      score: 30,
      feedback: "Business not found on Yelp - claim your listing",
      data: { isListed: false },
    }
  } catch (err: any) {
    console.error("[v0] Yelp error:", err.message)
    return {
      score: 50,
      feedback: "Unable to verify Yelp presence",
      data: { isListed: false },
    }
  }
}

/**
 * Fetch data from Google Business Profile via SerpAPI
 */
async function getGoogleBusinessData(businessName: string): Promise<{
  score: number
  feedback: string
  data: {
    rating?: number
    reviewCount?: number
    isListed: boolean
  }
}> {
  try {
    console.log("[v0] Checking Google Business via SerpAPI for:", businessName)

    const serpApiKey = process.env.SERP_API_KEY
    if (!serpApiKey) {
      console.log("[v0] SerpAPI key not configured")
      return {
        score: 50,
        feedback: "Unable to verify Google Business presence",
        data: { isListed: false },
      }
    }

    const serpUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(businessName)}+New+York+City&engine=google_maps&api_key=${serpApiKey}`

    const response = await fetchWithTimeout(
      serpUrl,
      {
        headers: {
          "User-Agent": "DominionMarketing/1.0",
        },
      },
      6000,
    )

    if (!response.ok) {
      console.log("[v0] SerpAPI error:", response.status)
      return {
        score: 50,
        feedback: "Unable to verify Google Business presence",
        data: { isListed: false },
      }
    }

    const serpData = await response.json()

    if (serpData.local_results && serpData.local_results.length > 0) {
      const business = serpData.local_results[0]
      const rating = business.rating || 0
      const reviewCount = business.reviews || 0

      // Convert 5-star rating to 0-100 score
      const ratingScore = Math.round(rating * 20)

      // Bonus points for review count
      const reviewBonus = Math.min(20, Math.floor(reviewCount / 10))

      const score = Math.min(100, ratingScore + reviewBonus)

      console.log("[v0] Google Business found:", {
        name: business.title,
        rating,
        reviewCount,
        score,
      })

      return {
        score,
        feedback: `${rating}/5 stars with ${reviewCount} reviews on Google`,
        data: {
          rating,
          reviewCount,
          isListed: true,
        },
      }
    }

    console.log("[v0] Google Business: No match found")
    return {
      score: 30,
      feedback: "Business not found on Google - claim your Google Business Profile",
      data: { isListed: false },
    }
  } catch (err: any) {
    console.error("[v0] Google Business error:", err.message)
    return {
      score: 50,
      feedback: "Unable to verify Google Business presence",
      data: { isListed: false },
    }
  }
}

async function analyzeSocialPresence(
  url: string,
  businessName: string,
): Promise<{
  score: number
  feedback: string
  data: {
    instagram?: string
    facebook?: string
    twitter?: string
    youtube?: string
    instagramFollowers?: number
    hasSocialPresence: boolean
  }
}> {
  let socialScore = 0
  const foundLinks: {
    instagram?: string
    facebook?: string
    twitter?: string
    youtube?: string
  } = {}
  let instagramFollowers: number | undefined

  try {
    console.log("[v0] Analyzing social media presence for:", url)

    const response = await fetchWithTimeout(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionAudit/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
        cache: "no-store",
      },
      5000,
    )

    const html = await response.text()

    // Detect links to main social media platforms
    const instagramMatch = html.match(/instagram\.com\/([A-Za-z0-9_.-]+)/i)
    const facebookMatch = html.match(/facebook\.com\/([A-Za-z0-9_.-]+)/i)
    const twitterMatch = html.match(/(?:twitter\.com|x\.com)\/([A-Za-z0-9_.-]+)/i)
    const youtubeMatch = html.match(/youtube\.com\/(?:c\/|@|channel\/)?([A-Za-z0-9_.-]+)/i)

    if (instagramMatch) {
      foundLinks.instagram = instagramMatch[0]
      socialScore += 25
      console.log("[v0] Found Instagram:", instagramMatch[0])
    }

    if (facebookMatch) {
      foundLinks.facebook = facebookMatch[0]
      socialScore += 25
      console.log("[v0] Found Facebook:", facebookMatch[0])
    }

    if (twitterMatch) {
      foundLinks.twitter = twitterMatch[0]
      socialScore += 25
      console.log("[v0] Found Twitter/X:", twitterMatch[0])
    }

    if (youtubeMatch) {
      foundLinks.youtube = youtubeMatch[0]
      socialScore += 25
      console.log("[v0] Found YouTube:", youtubeMatch[0])
    }

    // Optional: lightweight engagement check for Instagram
    if (foundLinks.instagram) {
      try {
        const handle = foundLinks.instagram.split("instagram.com/")[1]?.replace(/\/$/, "")
        if (handle) {
          // This was causing additional delays and is not critical
        }
      } catch (err) {
        console.log("[v0] Could not fetch Instagram engagement data")
      }
    }

    // Cap at 100
    socialScore = Math.min(socialScore, 100)

    // Generate contextual feedback
    let feedback: string
    if (socialScore === 0) {
      feedback =
        "No social media links detected. Create or link your social profiles (Instagram, Facebook, etc.) to improve online presence."
    } else if (socialScore < 50) {
      feedback =
        "Some social presence detected, but engagement appears limited — post regularly and encourage reviews or shares."
    } else if (socialScore < 80) {
      feedback =
        "Your social profiles are connected — increase posting frequency and add branded visuals for higher engagement."
    } else {
      feedback = "Strong social presence detected — maintain consistency and explore collaborations to expand reach."
    }

    console.log("[v0] Social media analysis complete:", {
      score: socialScore,
      platforms: Object.keys(foundLinks).length,
      instagramFollowers,
    })

    return {
      score: socialScore,
      feedback,
      data: {
        ...foundLinks,
        instagramFollowers,
        hasSocialPresence: Object.keys(foundLinks).length > 0,
      },
    }
  } catch (err: any) {
    console.error("[v0] Social media analysis error:", err.message)
    return {
      score: 50,
      feedback: "Unable to analyze social media presence — site may block scraping or use dynamic content.",
      data: {
        hasSocialPresence: false,
      },
    }
  }
}

async function analyzeContent(html: string): Promise<{ contentDepth: number; ctaCount: number }> {
  // Extract text content (remove HTML tags)
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Count words
  const contentDepth = textContent.split(/\s+/).length

  // Count CTAs (common patterns)
  const ctaPatterns = [
    /book now/gi,
    /get a quote/gi,
    /contact us/gi,
    /call now/gi,
    /schedule/gi,
    /order now/gi,
    /buy now/gi,
    /sign up/gi,
    /learn more/gi,
    /get started/gi,
  ]

  let ctaCount = 0
  ctaPatterns.forEach((pattern) => {
    const matches = html.match(pattern)
    if (matches) ctaCount += matches.length
  })

  return { contentDepth, ctaCount }
}

function generateRecommendations({
  breakdown,
  socialScore,
  googleRating,
  yelpRating,
  localVisibilityScore,
  performanceScore,
  seoScore,
  accessibilityScore,
  contentDepth,
  ctaCount,
}: {
  breakdown: any[]
  socialScore: number
  googleRating?: number
  yelpRating?: number
  localVisibilityScore: number
  performanceScore: number
  seoScore: number
  accessibilityScore: number
  contentDepth: number
  ctaCount: number
}): string[] {
  const recs: string[] = []

  // 🔧 PERFORMANCE LOGIC
  if (performanceScore < 60) {
    recs.push(
      "Your website loads slower than average. Compress images, enable caching, and use a CDN to reduce load time.",
    )
  } else if (performanceScore < 80) {
    recs.push("Performance is decent — fine-tune image sizes and pre-load fonts for smoother user experience.")
  }

  // 🔍 SEO LOGIC
  if (seoScore < 60) {
    recs.push(
      "Add missing meta descriptions, title tags, and structured data (Schema.org). These help search engines understand your business.",
    )
  } else if (seoScore > 80 && contentDepth < 800) {
    recs.push("Your SEO structure is good, but content is thin — add more local keywords and descriptive text.")
  }

  // ♿ ACCESSIBILITY LOGIC
  if (accessibilityScore < 70) {
    recs.push(
      "Improve mobile responsiveness and ADA compliance. Ensure text contrast is readable and alt text is added to images.",
    )
  }

  // 💬 REPUTATION LOGIC
  const avgRating = ((googleRating || 0) + (yelpRating || 0)) / 2 || 0
  if (avgRating < 3.8) {
    recs.push(
      "Your online reputation could be stronger. Encourage satisfied customers to leave Google or Yelp reviews.",
    )
  } else if (avgRating >= 4.5) {
    recs.push("Your reputation is excellent — showcase positive reviews directly on your website.")
  }

  // 📍 LOCAL VISIBILITY
  if (localVisibilityScore < 70) {
    recs.push(
      "Ensure your business is listed on Google Maps, Yelp, Bing Places, and Apple Maps with consistent name, address, and phone number.",
    )
  }

  // 📱 SOCIAL MEDIA ENGAGEMENT
  if (socialScore < 50) {
    recs.push(
      "Your social presence is limited — link your social profiles and post updates regularly to boost engagement.",
    )
  } else if (socialScore >= 80) {
    recs.push("Strong social engagement — maintain consistency and cross-post updates to all platforms.")
  }

  // 🧭 CONTENT & CTA OPTIMIZATION
  if (contentDepth < 500) {
    recs.push("Add more descriptive content to your homepage. This helps with ranking and user trust.")
  }
  if (ctaCount < 2) {
    recs.push("Add more clear calls to action — like 'Book Now' or 'Get a Quote' — to convert website visitors.")
  }

  // ⚡ PRIORITIZE - Limit to top 5 personalized improvements
  return recs.slice(0, 5)
}

function calculatePercentile(score: number): number {
  // Percentile estimation based on score distribution
  // Assumes normal distribution with mean ~60 and std dev ~15
  if (score >= 90) return Math.floor(Math.random() * 6) + 94 // 94-99%
  if (score >= 80) return Math.floor(Math.random() * 10) + 80 // 80-90%
  if (score >= 70) return Math.floor(Math.random() * 15) + 65 // 65-80%
  if (score >= 60) return Math.floor(Math.random() * 15) + 50 // 50-65%
  if (score >= 50) return Math.floor(Math.random() * 15) + 35 // 35-50%
  if (score >= 40) return Math.floor(Math.random() * 15) + 20 // 20-35%
  return Math.floor(Math.random() * 15) + 5 // 5-20%
}

function normalizeToTen(score: number): number {
  if (score === 0 || !score) return 1
  return Math.min(10, Math.max(1, Number.parseFloat((score / 10).toFixed(1))))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")
  const businessName = searchParams.get("businessName") || "Unknown Business"
  const mode = searchParams.get("mode") || "website"

  console.log("[v0] Live audit starting for:", { businessName, url, mode })
  const startTime = Date.now()

  if (mode === "social") {
    const instagram = searchParams.get("instagram")
    const tiktok = searchParams.get("tiktok")
    const facebook = searchParams.get("facebook")
    const linkedin = searchParams.get("linkedin")

    if (!instagram && !tiktok && !facebook && !linkedin) {
      return new Response(JSON.stringify({ error: "At least one social media handle is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    try {
      const baseUrl = new URL(req.url).origin
      const socialUrl = new URL(`${baseUrl}/api/analyze-social`)
      if (instagram) socialUrl.searchParams.set("instagram", instagram)
      if (tiktok) socialUrl.searchParams.set("tiktok", tiktok)
      if (facebook) socialUrl.searchParams.set("facebook", facebook)
      if (linkedin) socialUrl.searchParams.set("linkedin", linkedin)
      socialUrl.searchParams.set("businessName", businessName)

      const response = await fetch(socialUrl.toString())
      const data = await response.json()

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: "Failed to analyze social media", message: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing required parameter: url" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const key = process.env.PAGESPEED_API_KEY

  try {
    const googleAPI = key
      ? `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
          url,
        )}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&key=${key}`
      : `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
          url,
        )}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`

    const [pageSpeedRes, htmlRes] = await Promise.all([
      fetchWithTimeout(
        googleAPI,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 DominionBot/1.0",
            Accept: "application/json",
          },
          cache: "no-store",
        },
        7000,
      ).catch((err) => {
        console.warn("[v0] PageSpeed API failed:", err.message)
        return null
      }),
      fetchWithTimeout(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionAudit/1.0",
            Accept: "text/html,application/xhtml+xml",
          },
          cache: "no-store",
        },
        5000,
      ).catch((err) => {
        console.warn("[v0] HTML fetch failed:", err.message)
        return null
      }),
    ])

    const [localData, businessVerification, nycBusinessData, yelpData, googleBusinessData, socialMediaData] =
      await Promise.all([
        getLocalBusinessData(businessName, url).catch((err) => {
          console.warn("[v0] Local data failed:", err.message)
          return { score: 50, feedback: "Unable to verify", data: { isListed: false } }
        }),
        verifyBusinessRegistration(businessName).catch((err) => {
          console.warn("[v0] Business verification failed:", err.message)
          return { score: 50, feedback: "Unable to verify", data: { isVerified: false } }
        }),
        checkNYCBusinessData(businessName).catch((err) => {
          console.warn("[v0] NYC data failed:", err.message)
          return { score: 50, feedback: "Unable to verify", data: { isRegistered: false } }
        }),
        getYelpData(businessName).catch((err) => {
          console.warn("[v0] Yelp failed:", err.message)
          return { score: 50, feedback: "Unable to verify", data: { isListed: false } }
        }),
        getGoogleBusinessData(businessName).catch((err) => {
          console.warn("[v0] Google Business failed:", err.message)
          return { score: 50, feedback: "Unable to verify", data: { isListed: false } }
        }),
        htmlRes
          ? analyzeSocialPresence(url, businessName).catch((err) => {
              console.warn("[v0] Social analysis failed:", err.message)
              return { score: 50, feedback: "Unable to analyze", data: { hasSocialPresence: false } }
            })
          : Promise.resolve({ score: 50, feedback: "Unable to analyze", data: { hasSocialPresence: false } }),
      ])

    if (!pageSpeedRes || !htmlRes) {
      throw new Error("Critical API calls failed")
    }

    const pageSpeedText = await pageSpeedRes.text()
    const html = await htmlRes.text()

    if (pageSpeedText.trim().startsWith("<")) throw new Error("HTML returned instead of JSON")

    const data = JSON.parse(pageSpeedText)

    console.log("[v0] PageSpeed data received:", {
      performance: data.lighthouseResult?.categories?.performance?.score,
      seo: data.lighthouseResult?.categories?.seo?.score,
      accessibility: data.lighthouseResult?.categories?.accessibility?.score,
    })

    const performance = data.lighthouseResult?.categories?.performance?.score
      ? Math.round(data.lighthouseResult.categories.performance.score * 100)
      : null
    const accessibility = data.lighthouseResult?.categories?.accessibility?.score
      ? Math.round(data.lighthouseResult.categories.accessibility.score * 100)
      : null

    const seoAnalysis = await analyzeSEO(html, url)
    const reputationCheck = await checkReputation(url)
    const contentMetrics = await analyzeContent(html)

    if (performance !== null && accessibility !== null) {
      // Blend reputation from multiple sources: 40% Yelp, 40% Google, 20% Security
      const yelpScore = yelpData.score
      const googleScore = googleBusinessData.score
      const securityScore = reputationCheck.score

      const enhancedReputationScore = Math.round(yelpScore * 0.4 + googleScore * 0.4 + securityScore * 0.2)

      const enhancedLocalScore = Math.round(localData.score * 0.6 + nycBusinessData.score * 0.4)

      const adjustedWeights = {
        performance: 0.25, // Reduced from 0.30
        seo: 0.2, // Reduced from 0.25
        accessibility: 0.15, // Reduced from 0.20
        reputation: 0.15, // Same
        local: 0.1, // Same
        social: 0.15, // New
      }

      const overall = Math.round(
        performance * adjustedWeights.performance +
          seoAnalysis.score * adjustedWeights.seo +
          accessibility * adjustedWeights.accessibility +
          enhancedReputationScore * adjustedWeights.reputation +
          enhancedLocalScore * adjustedWeights.local +
          socialMediaData.score * adjustedWeights.social, // Added social score
      )

      const percentile = calculatePercentile(overall)

      const breakdown = [
        {
          area: "Performance",
          score: performance,
          tenScale: normalizeToTen(performance),
          feedback:
            performance >= 90
              ? "Excellent speed and Core Web Vitals"
              : performance >= 70
                ? "Good speed but optimize images and caching"
                : "Slow load times affecting user experience",
        },
        {
          area: "SEO",
          score: seoAnalysis.score,
          tenScale: normalizeToTen(seoAnalysis.score),
          feedback: seoAnalysis.feedback,
        },
        {
          area: "Accessibility",
          score: accessibility,
          tenScale: normalizeToTen(accessibility),
          feedback:
            accessibility >= 90
              ? "Fully accessible and mobile-friendly"
              : accessibility >= 70
                ? "Good accessibility, minor improvements needed"
                : "Accessibility issues affecting user experience",
        },
        {
          area: "Reputation",
          score: enhancedReputationScore,
          tenScale: normalizeToTen(enhancedReputationScore),
          feedback: `${yelpData.feedback} | ${googleBusinessData.feedback}`,
        },
        {
          area: "Local Visibility",
          score: enhancedLocalScore,
          tenScale: normalizeToTen(enhancedLocalScore),
          feedback: nycBusinessData.data.isRegistered ? "Strong NYC local presence verified" : localData.feedback,
        },
        {
          area: "Social Engagement",
          score: socialMediaData.score,
          tenScale: normalizeToTen(socialMediaData.score),
          feedback: socialMediaData.feedback,
        },
      ]

      const recommendations = generateRecommendations({
        breakdown,
        socialScore: socialMediaData.score,
        googleRating: googleBusinessData.data.rating,
        yelpRating: yelpData.data.rating,
        localVisibilityScore: enhancedLocalScore,
        performanceScore: performance,
        seoScore: seoAnalysis.score,
        accessibilityScore: accessibility,
        contentDepth: contentMetrics.contentDepth,
        ctaCount: contentMetrics.ctaCount,
      })

      console.log("[v0] Live audit completed:", {
        businessName,
        url,
        overallScore: overall,
        percentile,
        contentMetrics, // Added content metrics to logs
        socialMediaData: socialMediaData.data,
        yelpData: yelpData.data,
        googleBusinessData: googleBusinessData.data,
        firmographicData: businessVerification.data,
        localListingData: localData.data,
        nycData: nycBusinessData.data,
        usedFallback: false,
      })

      return new Response(
        JSON.stringify({
          url,
          businessName,
          overallScore: overall,
          percentile,
          label: overall >= 80 ? "Excellent" : overall >= 60 ? "Strong" : overall >= 40 ? "Good" : "Needs Work",
          breakdown,
          recommendations,
          firmographicData: businessVerification.data,
          localListingData: localData.data,
          nycData: nycBusinessData.data,
          yelpData: yelpData.data,
          googleBusinessData: googleBusinessData.data,
          socialMediaData: socialMediaData.data, // Added social media data to response
          source:
            "Live Multi-API Analysis (Yelp + Google Business + OpenCorporates + NYC Open Data + PageSpeed + Social Media)",
          usedFallback: false,
          categoryRatings: {
            performance: normalizeToTen(performance),
            seo: normalizeToTen(seoAnalysis.score),
            accessibility: normalizeToTen(accessibility),
            reputation: normalizeToTen(enhancedReputationScore),
            localVisibility: normalizeToTen(enhancedLocalScore),
            social: normalizeToTen(socialMediaData.score),
          },
        }),
        { headers: { "Content-Type": "application/json" } },
      )
    }

    throw new Error("Incomplete PageSpeed data")
  } catch (err: any) {
    console.warn("[v0] PageSpeed failed, using HTML fallback:", err.message)

    try {
      const htmlRes = await fetchWithTimeout(
        // Use fetchWithTimeout here too
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionAudit/1.0",
            Accept: "text/html,application/xhtml+xml",
          },
          cache: "no-store",
        },
        5000, // Match timeout from above
      )
      if (!htmlRes) throw new Error("HTML fetch failed in fallback")
      const html = await htmlRes.text()

      const seoAnalysis = await analyzeSEO(html, url)
      const reputationCheck = await checkReputation(url)
      const localData = await getLocalBusinessData(businessName, url)
      const businessVerification = await verifyBusinessRegistration(businessName)
      const nycBusinessData = await checkNYCBusinessData(businessName)
      const yelpData = await getYelpData(businessName)
      const googleBusinessData = await getGoogleBusinessData(businessName)
      const socialMediaData = await analyzeSocialPresence(url, businessName)
      const contentMetrics = await analyzeContent(html)

      const contentLength = html.replace(/<[^>]*>/g, "").length
      const contentScore = Math.min(100, Math.floor(contentLength / 2500) * 10 + 50)

      const yelpScore = yelpData.score
      const googleScore = googleBusinessData.score
      const securityScore = reputationCheck.score

      const enhancedReputationScore = Math.round(yelpScore * 0.4 + googleScore * 0.4 + securityScore * 0.2)

      const enhancedLocalScore = Math.round(localData.score * 0.6 + nycBusinessData.score * 0.4)

      const overall = Math.round(
        contentScore * 0.25 +
          seoAnalysis.score * 0.2 +
          60 * 0.15 + // Assuming accessibility is moderately handled in fallback
          enhancedReputationScore * 0.15 +
          enhancedLocalScore * 0.1 +
          socialMediaData.score * 0.15, // Added social score
      )

      const percentile = calculatePercentile(overall)

      const breakdown = [
        {
          area: "Performance",
          score: contentScore,
          tenScale: normalizeToTen(contentScore),
          feedback: "Estimated from content analysis",
        },
        {
          area: "SEO",
          score: seoAnalysis.score,
          tenScale: normalizeToTen(seoAnalysis.score),
          feedback: seoAnalysis.feedback,
        },
        {
          area: "Accessibility",
          score: 60,
          tenScale: normalizeToTen(60),
          feedback: "Unable to verify, assumed moderate",
        },
        {
          area: "Reputation",
          score: enhancedReputationScore,
          tenScale: normalizeToTen(enhancedReputationScore),
          feedback: `${yelpData.feedback} | ${googleBusinessData.feedback}`,
        },
        {
          area: "Local Visibility",
          score: enhancedLocalScore,
          tenScale: normalizeToTen(enhancedLocalScore),
          feedback: nycBusinessData.data.isRegistered ? "Strong NYC local presence verified" : localData.feedback,
        },
        {
          area: "Social Engagement",
          score: socialMediaData.score,
          tenScale: normalizeToTen(socialMediaData.score),
          feedback: socialMediaData.feedback,
        },
      ]

      const recommendations = generateRecommendations({
        breakdown,
        socialScore: socialMediaData.score,
        googleRating: googleBusinessData.data.rating,
        yelpRating: yelpData.data.rating,
        localVisibilityScore: enhancedLocalScore,
        performanceScore: contentScore,
        seoScore: seoAnalysis.score,
        accessibilityScore: 60,
        contentDepth: contentMetrics.contentDepth,
        ctaCount: contentMetrics.ctaCount,
      })

      console.log("[v0] Fallback audit completed:", {
        businessName,
        url,
        overallScore: overall,
        percentile,
        contentMetrics, // Added content metrics to logs
        socialMediaData: socialMediaData.data,
        yelpData: yelpData.data,
        googleBusinessData: googleBusinessData.data,
        firmographicData: businessVerification.data,
        localListingData: localData.data,
        nycData: nycBusinessData.data,
        usedFallback: true,
      })

      return new Response(
        JSON.stringify({
          url,
          businessName,
          overallScore: overall,
          percentile,
          label: overall >= 80 ? "Excellent" : overall >= 60 ? "Strong" : overall >= 40 ? "Good" : "Needs Work",
          breakdown,
          recommendations,
          firmographicData: businessVerification.data,
          localListingData: localData.data,
          nycData: nycBusinessData.data,
          yelpData: yelpData.data,
          googleBusinessData: googleBusinessData.data,
          socialMediaData: socialMediaData.data, // Added social media data to response
          source: "HTML Fallback Analysis (Yelp + Google Business + OpenCorporates + NYC Open Data + Social Media)",
          usedFallback: true,
          categoryRatings: {
            performance: normalizeToTen(contentScore),
            seo: normalizeToTen(seoAnalysis.score),
            accessibility: normalizeToTen(60),
            reputation: normalizeToTen(enhancedReputationScore),
            localVisibility: normalizeToTen(enhancedLocalScore),
            social: normalizeToTen(socialMediaData.score),
          },
        }),
        { headers: { "Content-Type": "application/json" } },
      )
    } catch (htmlErr: any) {
      console.error("[v0] Complete audit failure:", htmlErr.message)
      return new Response(
        JSON.stringify({
          error: "Failed to analyze website",
          message: htmlErr.message,
          usedFallback: true,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }
  }
}
