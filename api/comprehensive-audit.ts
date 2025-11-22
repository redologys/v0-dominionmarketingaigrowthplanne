export const config = {
  runtime: "edge",
}

interface AuditRequest {
  businessName: string
  websiteUrl: string
  location?: string
}

interface AuditResponse {
  finalScore: number
  onPageSeoScore: number
  brandClarityScore: number
  localSeoScore: number
  safetyScore: number
  logoUrl: string | null
  companyData: any
  pagespeedData: any
  domainAgeData: any
  safeBrowsingStatus: string
  yelpData: any
}

async function fetchClearbitCompany(businessName: string) {
  try {
    const res = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(businessName)}`,
    )
    if (!res.ok) return null
    const data = await res.json()
    return data[0] || null
  } catch {
    return null
  }
}

async function fetchClearbitLogo(domain: string): Promise<string | null> {
  try {
    const logoUrl = `https://logo.clearbit.com/${domain}?size=200`
    const res = await fetch(logoUrl, { method: "HEAD" })
    return res.ok ? logoUrl : null
  } catch {
    return null
  }
}

async function fetchPageSpeedData(url: string) {
  try {
    const apiKey = process.env.PAGESPEED_API_KEY || ""
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile&key=${apiKey}`

    const res = await fetch(apiUrl)
    if (!res.ok) return null

    const data = await res.json()
    return data.lighthouseResult?.categories || null
  } catch {
    return null
  }
}

async function checkSafeBrowsing(url: string): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY || ""
    if (!apiKey) return "unknown"

    const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { clientId: "auditTool", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
    })

    if (!res.ok) return "unknown"
    const data = await res.json()
    return data.matches && data.matches.length > 0 ? "threat_found" : "safe"
  } catch {
    return "unknown"
  }
}

async function fetchDomainAge(domain: string) {
  try {
    const res = await fetch(`https://api.domainsdb.info/v1/domains/search?domain=${domain}`)
    if (!res.ok) return null

    const data = await res.json()
    if (!data.domains || data.domains.length === 0) return null

    return {
      created: data.domains[0].create_date,
      updated: data.domains[0].update_date,
      expires: data.domains[0].expiration_date,
    }
  } catch {
    return null
  }
}

async function fetchYelpData(businessName: string, location = "United States") {
  try {
    const apiKey = process.env.YELP_API_KEY || ""
    if (!apiKey) return null

    const res = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(businessName)}&location=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )

    if (!res.ok) return null
    const data = await res.json()
    return data.businesses && data.businesses.length > 0 ? data.businesses[0] : null
  } catch {
    return null
  }
}

function calculateOnPageSeoScore(pagespeedData: any): number {
  if (!pagespeedData) return 0

  const seoScore = (pagespeedData.seo?.score || 0) * 100
  const performance = (pagespeedData.performance?.score || 0) * 100

  let finalScore = seoScore

  if (performance < 30) {
    finalScore -= 10
  } else if (performance < 60) {
    finalScore -= 5
  }

  return Math.max(0, Math.min(100, Math.round(finalScore)))
}

function calculateBrandClarityScore(
  queryDomain: string,
  clearbitDomain: string | null,
  logoExists: boolean,
  businessName: string,
  clearbitName: string | null,
): number {
  let score = 0

  // Domain matching (0-50 points)
  if (clearbitDomain) {
    if (queryDomain === clearbitDomain) {
      score += 50
    } else if (queryDomain.replace(/\.(com|org|net)$/, "") === clearbitDomain.replace(/\.(com|org|net)$/, "")) {
      score += 30
    } else {
      score += 10
    }
  } else {
    score += 10
  }

  // Logo existence (0-30 points)
  if (logoExists) {
    score += 30
  }

  // Name similarity (0-20 points)
  if (clearbitName) {
    const similarity = calculateSimilarity(businessName.toLowerCase(), clearbitName.toLowerCase())
    score += Math.round(similarity * 20)
  } else {
    score += 10
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

function calculateLocalSeoScore(yelpData: any, domainAgeData: any): number {
  if (yelpData) {
    const ratingWeight = (yelpData.rating / 5) * 20
    const reviewWeight = (Math.min(yelpData.review_count, 200) / 200) * 40
    const categoryConfidence = yelpData.categories && yelpData.categories.length > 0 ? 20 : 0

    return Math.max(0, Math.min(100, Math.round(ratingWeight + reviewWeight + categoryConfidence + 20)))
  }

  // Fallback to domain age
  if (domainAgeData && domainAgeData.created) {
    const createdDate = new Date(domainAgeData.created)
    const now = new Date()
    const ageInYears = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365)

    let score = 10
    if (ageInYears >= 10) score = 90
    else if (ageInYears >= 5) score = 70
    else if (ageInYears >= 2) score = 50
    else if (ageInYears >= 1) score = 30

    return Math.max(0, Math.min(100, score))
  }

  return 10
}

function calculateSafetyScore(safeBrowsingStatus: string, hasHTTPS: boolean): number {
  if (safeBrowsingStatus === "threat_found") return 0

  let score = 100

  if (!hasHTTPS) {
    score -= 40
  }

  return Math.max(0, Math.min(100, score))
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body: AuditRequest = await req.json()
    const { businessName, websiteUrl, location } = body

    if (!businessName || !websiteUrl) {
      return new Response(JSON.stringify({ error: "businessName and websiteUrl are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const domain = new URL(websiteUrl).hostname.replace("www.", "")
    const hasHTTPS = websiteUrl.startsWith("https://")

    console.log("[v0] Starting comprehensive audit for:", businessName, domain)

    const [clearbitCompany, pagespeedData, safeBrowsingStatus, domainAgeData, yelpData] = await Promise.all([
      fetchClearbitCompany(businessName),
      fetchPageSpeedData(websiteUrl),
      checkSafeBrowsing(websiteUrl),
      fetchDomainAge(domain),
      fetchYelpData(businessName, location),
    ])

    console.log("[v0] Clearbit company:", clearbitCompany)
    console.log("[v0] PageSpeed data:", pagespeedData)
    console.log("[v0] Safe Browsing:", safeBrowsingStatus)
    console.log("[v0] Domain age:", domainAgeData)
    console.log("[v0] Yelp data:", yelpData)

    const clearbitDomain = clearbitCompany?.domain || null
    const logoUrl = clearbitDomain ? await fetchClearbitLogo(clearbitDomain) : null

    const onPageSeoScore = calculateOnPageSeoScore(pagespeedData)
    const brandClarityScore = calculateBrandClarityScore(
      domain,
      clearbitDomain,
      !!logoUrl,
      businessName,
      clearbitCompany?.name || null,
    )
    const localSeoScore = calculateLocalSeoScore(yelpData, domainAgeData)
    const safetyScore = calculateSafetyScore(safeBrowsingStatus, hasHTTPS)

    const finalScore = Math.round(
      onPageSeoScore * 0.4 + brandClarityScore * 0.25 + localSeoScore * 0.2 + safetyScore * 0.15,
    )

    console.log("[v0] Final scores:", {
      final: finalScore,
      onPage: onPageSeoScore,
      brand: brandClarityScore,
      local: localSeoScore,
      safety: safetyScore,
    })

    const response: AuditResponse = {
      finalScore,
      onPageSeoScore,
      brandClarityScore,
      localSeoScore,
      safetyScore,
      logoUrl,
      companyData: clearbitCompany,
      pagespeedData,
      domainAgeData,
      safeBrowsingStatus,
      yelpData,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0] Audit error:", error)
    return new Response(JSON.stringify({ error: "Audit failed", message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
