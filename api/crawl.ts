import * as cheerio from "cheerio"

export const config = {
  runtime: "edge",
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionAudit/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    })

    const html = await res.text()
    const $ = cheerio.load(html)

    // Basic structural checks
    const title = $("title").text().trim()
    const metaDesc = $('meta[name="description"]').attr("content") || ""
    const h1Count = $("h1").length
    const imgCount = $("img").length
    const scriptCount = $("script").length

    // Simple scoring model
    const seoScore = Math.min(100, (metaDesc.length > 50 ? 80 : 50) + h1Count * 5)
    const contentScore = Math.min(100, (title ? 20 : 0) + Math.min(40, imgCount * 2))
    const techScore = Math.min(100, scriptCount * 4)

    const overall = Math.round(seoScore * 0.4 + contentScore * 0.3 + techScore * 0.3)

    return new Response(
      JSON.stringify({
        url,
        fallback: true,
        title,
        metaDesc,
        h1Count,
        imgCount,
        scriptCount,
        seoScore,
        contentScore,
        techScore,
        overall,
        note: "Fallback AI crawl mode used — approximate score based on live HTML scan.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Crawl failed",
        message: (err as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
