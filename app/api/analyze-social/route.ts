export const runtime = "edge"

interface SocialMetrics {
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

async function analyzeInstagram(handle: string): Promise<SocialMetrics> {
  try {
    const url = `https://www.instagram.com/${handle}/`
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    const html = await response.text()

    const hasProfile = html.includes('"username"')
    const hasContent = html.includes('"edge_owner_to_timeline_media"')
    const isActive = html.includes('"edge_followed_by"')

    const score = (hasProfile ? 30 : 0) + (hasContent ? 40 : 0) + (isActive ? 30 : 0)

    return {
      platform: "Instagram",
      handle: `@${handle}`,
      score,
      metrics: {
        brandConsistency: hasProfile ? 75 : 50,
        postsPerWeek: hasContent ? 3 : 0,
      },
      feedback: hasProfile ? "Profile found with content" : "Profile may be private or inactive",
    }
  } catch (err) {
    return {
      platform: "Instagram",
      handle: `@${handle}`,
      score: 0,
      metrics: {},
      feedback: "Unable to analyze profile",
    }
  }
}

async function analyzeTikTok(handle: string): Promise<SocialMetrics> {
  try {
    const url = `https://www.tiktok.com/@${handle}`
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    const html = await response.text()
    const hasProfile = html.includes('"uniqueId"') || html.includes("user-page")
    const hasVideos = html.includes('"videoCount"')

    const score = (hasProfile ? 50 : 0) + (hasVideos ? 50 : 0)

    return {
      platform: "TikTok",
      handle: `@${handle}`,
      score,
      metrics: {
        brandConsistency: hasProfile ? 70 : 40,
      },
      feedback: hasProfile ? "Active TikTok presence detected" : "Profile not found or private",
    }
  } catch (err) {
    return {
      platform: "TikTok",
      handle: `@${handle}`,
      score: 0,
      metrics: {},
      feedback: "Unable to analyze profile",
    }
  }
}

async function analyzeFacebookOrLinkedIn(handle: string, platform: string): Promise<SocialMetrics> {
  try {
    const url =
      platform === "Facebook" ? `https://www.facebook.com/${handle}` : `https://www.linkedin.com/company/${handle}`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    const html = await response.text()
    const hasProfile = html.includes("og:title") || html.includes("og:description")
    const hasContent = html.length > 10000

    const score = (hasProfile ? 60 : 0) + (hasContent ? 40 : 0)

    return {
      platform,
      handle,
      score,
      metrics: {
        brandConsistency: hasProfile ? 80 : 50,
      },
      feedback: hasProfile ? `${platform} page found` : "Page not accessible",
    }
  } catch (err) {
    return {
      platform,
      handle,
      score: 0,
      metrics: {},
      feedback: "Unable to analyze page",
    }
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const businessName = searchParams.get("businessName") || "Unknown Business"
  const instagram = searchParams.get("instagram")
  const tiktok = searchParams.get("tiktok")
  const facebook = searchParams.get("facebook")
  const linkedin = searchParams.get("linkedin")

  const analyses: SocialMetrics[] = []

  const promises: Promise<SocialMetrics>[] = []
  if (instagram) promises.push(analyzeInstagram(instagram))
  if (tiktok) promises.push(analyzeTikTok(tiktok))
  if (facebook) promises.push(analyzeFacebookOrLinkedIn(facebook, "Facebook"))
  if (linkedin) promises.push(analyzeFacebookOrLinkedIn(linkedin, "LinkedIn"))

  const results = await Promise.all(promises)
  analyses.push(...results)

  const totalScore = analyses.reduce((sum, a) => sum + a.score, 0)
  const avgScore = Math.round(totalScore / analyses.length)

  const activePlatforms = analyses.filter((a) => a.score > 50).length
  const summary =
    activePlatforms >= 3
      ? `${businessName} has a strong multi-platform presence with ${activePlatforms} active channels. Focus on consistent posting and engagement.`
      : activePlatforms >= 1
        ? `${businessName} has ${activePlatforms} active social channel(s). Consider expanding to more platforms for broader reach.`
        : `${businessName} needs to establish social media presence. Start with 1-2 platforms where your audience is most active.`

  return new Response(
    JSON.stringify({
      mode: "social",
      businessName,
      overallScore: avgScore,
      label: avgScore >= 75 ? "Excellent" : avgScore >= 50 ? "Good" : "Needs Work",
      breakdown: analyses,
      summary,
    }),
    { headers: { "Content-Type": "application/json" } },
  )
}
