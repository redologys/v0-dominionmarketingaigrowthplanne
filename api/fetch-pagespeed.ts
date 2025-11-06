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
    const encodedUrl = encodeURIComponent(url)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&category=performance&category=seo&strategy=desktop`

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionBot/1.0",
        Accept: "application/json",
      },
      redirect: "follow",
    })

    const text = await response.text()

    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      // Fallback to lightweight site check
      const fallback = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) DominionAudit/1.0",
        },
      })
      const html = await fallback.text()

      const hasMeta = html.includes("<meta") || html.includes("<title>")
      const hasScripts = html.includes("<script")
      const performance = hasScripts ? 60 : 80
      const seo = hasMeta ? 75 : 50

      return new Response(
        JSON.stringify({
          url,
          performance,
          seo,
          fallback: true,
          note: "Fallback mode: site blocked PageSpeed, estimated via direct crawl.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    const data = JSON.parse(text)

    if (!data.lighthouseResult?.categories) {
      return new Response(
        JSON.stringify({
          error: "Missing expected data in PageSpeed response. Try another site.",
          raw: data,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    const performance = data.lighthouseResult.categories.performance?.score ?? 0
    const seo = data.lighthouseResult.categories.seo?.score ?? 0

    return new Response(
      JSON.stringify({
        url,
        performance: Math.round(performance * 100),
        seo: Math.round(seo * 100),
        fallback: false,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Fetch failed",
        message: (err as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
