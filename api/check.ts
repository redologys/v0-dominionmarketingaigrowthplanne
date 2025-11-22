export const config = {
  runtime: "edge",
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
    const response = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "Mozilla/5.0 DominionBot/1.0" },
    })

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
    // Use OpenStreetMap Nominatim API (free, no key required)
    const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(businessName)}&format=json&limit=1`
    const response = await fetch(searchUrl, {
      headers: { "User-Agent": "DominionMarketing/1.0" },
    })

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

function generateRecommendations(breakdown: any[], mode: string): string[] {
  const recommendations: string[] = []

  if (mode === "website") {
    const perfScore = breakdown.find((b) => b.area === "Performance")?.score || 0
    const seoScore = breakdown.find((b) => b.area === "SEO")?.score || 0
    const accessScore = breakdown.find((b) => b.area === "Accessibility")?.score || 0
    const repScore = breakdown.find((b) => b.area === "Reputation")?.score || 0
    const localScore = breakdown.find((b) => b.area === "Local Visibility")?.score || 0

    if (perfScore < 70) {
      recommendations.push("Optimize images and enable caching to improve load times")
    }
    if (seoScore < 70) {
      recommendations.push("Add structured data (Schema.org) for better search visibility")
    }
    if (accessScore < 70) {
      recommendations.push("Improve mobile responsiveness and add alt text to images")
    }
    if (repScore < 70) {
      recommendations.push("Enable HTTPS and add security headers for better trust")
    }
    if (localScore < 70) {
      recommendations.push("Claim your Google Business Profile and local directory listings")
    }

    if (recommendations.length === 0) {
      recommendations.push("Maintain your excellent digital presence with regular content updates")
      recommendations.push("Build quality backlinks from reputable industry sources")
      recommendations.push("Monitor Core Web Vitals and maintain fast load times")
    }
  } else if (mode === "business") {
    const googleScore = breakdown.find((b) => b.area === "Google Presence")?.score || 0
    const yelpScore = breakdown.find((b) => b.area === "Review Sites")?.score || 0
    const localScore = breakdown.find((b) => b.area === "Local Visibility")?.score || 0
    const websiteScore = breakdown.find((b) => b.area === "Website")?.score || 0

    if (googleScore < 70) {
      recommendations.push("Claim and optimize your Google Business Profile")
    }
    if (yelpScore < 70) {
      recommendations.push("Create and manage your Yelp business listing")
    }
    if (localScore < 70) {
      recommendations.push("Add your business to local directories and map services")
    }
    if (websiteScore < 70) {
      recommendations.push("Create a professional website to establish credibility")
    }
    recommendations.push("Encourage satisfied customers to leave reviews")
    recommendations.push("Keep your business information consistent across all platforms")
  } else {
    recommendations.push("Post consistently 3-5 times per week across all platforms")
    recommendations.push("Use platform-specific features like Reels, Stories, and TikTok trends")
    recommendations.push("Engage with your audience through comments and direct messages")
    recommendations.push("Create a content calendar for consistent branding")
    recommendations.push("Track analytics and adjust strategy based on performance")
  }

  return recommendations.slice(0, 5)
}

async function analyzeBusinessByName(businessName: string): Promise<any> {
  try {
    console.log("[v0] Analyzing business by name:", businessName)

    // Search multiple sources for business presence
    const [googleResults, yelpResults, localCheck] = await Promise.all([
      searchGoogleBusiness(businessName),
      searchYelp(businessName),
      checkLocalVisibility(businessName),
    ])

    console.log("[v0] Google results:", googleResults)
    console.log("[v0] Yelp results:", yelpResults)
    console.log("[v0] Local check:", localCheck)

    // Calculate scores based on findings
    const googleScore = googleResults.found ? 85 : 30
    const yelpScore = yelpResults.found ? 80 : 25
    const localScore = localCheck.score

    // Check for website from Google results
    let websiteScore = 50
    if (googleResults.website) {
      websiteScore = 90
    }

    // Calculate overall score
    const overall = Math.round(googleScore * 0.35 + yelpScore * 0.2 + localScore * 0.2 + websiteScore * 0.25)

    const breakdown = [
      {
        area: "Google Presence",
        score: googleScore,
        feedback: googleResults.feedback,
      },
      {
        area: "Review Sites",
        score: yelpScore,
        feedback: yelpResults.feedback,
      },
      {
        area: "Local Visibility",
        score: localScore,
        feedback: localCheck.feedback,
      },
      {
        area: "Website",
        score: websiteScore,
        feedback: googleResults.website ? "Website found" : "No website detected",
      },
    ]

    const recommendations = [
      googleScore < 70 ? "Claim and optimize your Google Business Profile" : null,
      yelpScore < 70 ? "Create and manage your Yelp business listing" : null,
      localScore < 70 ? "Add your business to local directories and map services" : null,
      websiteScore < 70 ? "Create a professional website to establish credibility" : null,
      "Encourage satisfied customers to leave reviews",
      "Keep your business information consistent across all platforms",
    ]
      .filter(Boolean)
      .slice(0, 5)

    return {
      businessName,
      overallScore: overall,
      label: overall >= 75 ? "Excellent" : overall >= 50 ? "Good" : "Needs Work",
      breakdown,
      recommendations,
      source: "Multi-Source Business Search",
      foundWebsite: googleResults.website || null,
    }
  } catch (err: any) {
    console.error("[v0] Error analyzing business:", err)
    throw new Error("Failed to analyze business online presence")
  }
}

async function searchGoogleBusiness(businessName: string): Promise<any> {
  try {
    const serpApiKey = process.env.SERP_API_KEY
    if (!serpApiKey) {
      console.warn("[v0] No SERP API key found, using limited search")
      return {
        found: false,
        feedback: "Limited search capability - add SERP API key for full analysis",
        website: null,
      }
    }

    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(businessName)}&api_key=${serpApiKey}&engine=google&num=10`

    const response = await fetch(url)
    const data = await response.json()

    console.log("[v0] SERP API response:", JSON.stringify(data).substring(0, 500))

    // Check if business appears in results
    const hasKnowledgeGraph = data.knowledge_graph !== undefined
    const hasLocalResults = data.local_results && data.local_results.length > 0
    const organicResults = data.organic_results || []

    let website = null
    if (hasKnowledgeGraph && data.knowledge_graph.website) {
      website = data.knowledge_graph.website
    } else if (hasLocalResults && data.local_results[0]?.website) {
      website = data.local_results[0].website
    } else if (organicResults.length > 0) {
      website = organicResults[0].link
    }

    const found = hasKnowledgeGraph || hasLocalResults || organicResults.length > 0

    return {
      found,
      website,
      feedback: hasKnowledgeGraph
        ? "Prominent Google presence with knowledge panel"
        : hasLocalResults
          ? "Found in local search results"
          : found
            ? "Appears in search results"
            : "Limited Google visibility",
    }
  } catch (err) {
    console.error("[v0] Google search error:", err)
    return {
      found: false,
      feedback: "Unable to search Google",
      website: null,
    }
  }
}

async function searchYelp(businessName: string): Promise<any> {
  try {
    const yelpApiKey = process.env.YELP_API_KEY
    if (!yelpApiKey) {
      console.warn("[v0] No Yelp API key found")
      return {
        found: false,
        feedback: "Yelp search unavailable",
      }
    }

    const url = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(businessName)}&limit=5`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${yelpApiKey}`,
      },
    })

    const data = await response.json()
    console.log("[v0] Yelp response:", JSON.stringify(data).substring(0, 500))

    const found = data.businesses && data.businesses.length > 0
    const topResult = data.businesses?.[0]

    return {
      found,
      feedback: found
        ? `Found on Yelp${topResult?.rating ? ` with ${topResult.rating} star rating` : ""}`
        : "Not found on Yelp - claim your listing",
    }
  } catch (err) {
    console.error("[v0] Yelp search error:", err)
    return {
      found: false,
      feedback: "Unable to search Yelp",
    }
  }
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")
  const businessName = searchParams.get("businessName") || "Unknown Business"
  const mode = searchParams.get("mode") || "website"

  console.log("[v0] Check API called with mode:", mode, "businessName:", businessName)

  if (mode === "business") {
    try {
      const result = await analyzeBusinessByName(businessName)
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (err: any) {
      console.error("[v0] Business analysis error:", err)
      return new Response(JSON.stringify({ error: "Failed to analyze business", message: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

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

    const [pageSpeedRes, htmlRes, localCheck] = await Promise.all([
      fetch(googleAPI, {
        headers: {
          "User-Agent": "Mozilla/5.0 DominionBot/1.0",
          Accept: "application/json",
        },
      }),
      fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionAudit/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
      }),
      checkLocalVisibility(businessName),
    ])

    const pageSpeedText = await pageSpeedRes.text()
    const html = await htmlRes.text()

    if (pageSpeedText.trim().startsWith("<")) throw new Error("HTML returned instead of JSON")

    const data = JSON.parse(pageSpeedText)

    const performance = data.lighthouseResult?.categories?.performance?.score
      ? Math.round(data.lighthouseResult.categories.performance.score * 100)
      : null
    const accessibility = data.lighthouseResult?.categories?.accessibility?.score
      ? Math.round(data.lighthouseResult.categories.accessibility.score * 100)
      : null

    const seoAnalysis = await analyzeSEO(html, url)

    const reputationCheck = await checkReputation(url)

    if (performance !== null && accessibility !== null) {
      const weights = {
        performance: 0.25,
        seo: 0.2,
        accessibility: 0.1,
        reputation: 0.15,
        local: 0.15,
        social: 0.15,
      }

      // For website mode, redistribute social weight to other categories
      const adjustedWeights = {
        performance: 0.3,
        seo: 0.25,
        accessibility: 0.15,
        reputation: 0.15,
        local: 0.15,
      }

      const overall = Math.round(
        performance * adjustedWeights.performance +
          seoAnalysis.score * adjustedWeights.seo +
          accessibility * adjustedWeights.accessibility +
          reputationCheck.score * adjustedWeights.reputation +
          localCheck.score * adjustedWeights.local,
      )

      const breakdown = [
        { area: "Performance", score: performance, feedback: "Site speed and Core Web Vitals" },
        { area: "SEO", score: seoAnalysis.score, feedback: seoAnalysis.feedback },
        { area: "Accessibility", score: accessibility, feedback: "Mobile-friendliness and ADA compliance" },
        { area: "Reputation", score: reputationCheck.score, feedback: reputationCheck.feedback },
        { area: "Local Visibility", score: localCheck.score, feedback: localCheck.feedback },
      ]

      const recommendations = generateRecommendations(breakdown, "website")

      return new Response(
        JSON.stringify({
          url,
          businessName,
          overallScore: overall,
          label: overall >= 80 ? "Excellent" : overall >= 60 ? "Strong" : overall >= 40 ? "Good" : "Needs Work",
          breakdown,
          recommendations,
          source: "Multi-source Analysis",
          usedFallback: false,
        }),
        { headers: { "Content-Type": "application/json" } },
      )
    }

    throw new Error("Incomplete PageSpeed data")
  } catch (err: any) {
    console.warn("⚠️ PageSpeed failed, using HTML fallback:", err.message)

    try {
      const htmlRes = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionAudit/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
      })
      const html = await htmlRes.text()

      const seoAnalysis = await analyzeSEO(html, url)
      const reputationCheck = await checkReputation(url)
      const localCheck = await checkLocalVisibility(businessName)

      const contentLength = html.replace(/<[^>]*>/g, "").length
      const contentScore = Math.min(100, Math.floor(contentLength / 2500) * 10 + 50)

      const overall = Math.round(
        contentScore * 0.3 +
          seoAnalysis.score * 0.25 +
          reputationCheck.score * 0.15 +
          localCheck.score * 0.15 +
          60 * 0.15, // Assume moderate accessibility
      )

      const breakdown = [
        { area: "Performance", score: contentScore, feedback: "Estimated from content analysis" },
        { area: "SEO", score: seoAnalysis.score, feedback: seoAnalysis.feedback },
        { area: "Accessibility", score: 60, feedback: "Unable to verify, assumed moderate" },
        { area: "Reputation", score: reputationCheck.score, feedback: reputationCheck.feedback },
        { area: "Local Visibility", score: localCheck.score, feedback: localCheck.feedback },
      ]

      const recommendations = generateRecommendations(breakdown, "website")

      return new Response(
        JSON.stringify({
          url,
          businessName,
          overallScore: overall,
          label: overall >= 80 ? "Excellent" : overall >= 60 ? "Strong" : overall >= 40 ? "Good" : "Needs Work",
          breakdown,
          recommendations,
          source: "HTML Fallback",
          usedFallback: true,
        }),
        { headers: { "Content-Type": "application/json" } },
      )
    } catch (htmlErr: any) {
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
