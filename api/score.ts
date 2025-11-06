export const config = {
  runtime: "edge",
}

interface ScoreRequest {
  businessName: string
  websiteURL: string
  performance: number
  seo: number
  techDepth: number
  visibility: number
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { performance, seo, techDepth, visibility, businessName, websiteURL }: ScoreRequest = await req.json()

    // Calculate weighted total score
    const totalScore = Math.round(performance * 0.3 + seo * 0.3 + techDepth * 0.2 + visibility * 0.2)

    // Generate insights based on scores
    const insights: string[] = []
    if (performance < 70) insights.push("Improve Core Web Vitals and image compression for faster loading speed.")
    if (seo < 70) insights.push("Add meta tags, schema markup, and mobile optimizations to boost SEO.")
    if (techDepth < 50) insights.push("Use modern analytics and CMS frameworks for better scalability.")
    if (visibility < 50) insights.push("Increase reviews and brand mentions across Google and social media.")

    return new Response(
      JSON.stringify({
        businessName,
        websiteURL,
        performance,
        seo,
        techDepth,
        visibility,
        totalScore,
        insights,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}
