import type { VercelRequest, VercelResponse } from "@vercel/node"

interface ReportRequest {
  businessName: string
  websiteURL: string
  performance: number
  seo: number
  techDepth: number
  visibility: number
  totalScore: number
  insights: string[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const data = req.body as ReportRequest

    // Generate simple HTML report (PDF generation requires additional libraries)
    const html = generateHTMLReport(data)

    // For now, return HTML. In production, use a PDF library like puppeteer or jsPDF
    res.setHeader("Content-Type", "text/html")
    res.setHeader("Content-Disposition", `attachment; filename="presence-report-${Date.now()}.html"`)
    return res.status(200).send(html)
  } catch (error: any) {
    console.error("Error generating report:", error)
    return res.status(500).json({ error: error.message || "Failed to generate report" })
  }
}

function generateHTMLReport(data: ReportRequest): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Online Presence Report - ${data.businessName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0B1221 0%, #1a2332 100%);
      color: #fff;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 40px;
      backdrop-filter: blur(10px);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #FFD700;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #FFD700;
      margin-bottom: 10px;
    }
    .date {
      color: #9ca3af;
      font-size: 14px;
    }
    .business-info {
      margin-bottom: 30px;
    }
    .business-name {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .website {
      color: #60a5fa;
      text-decoration: none;
    }
    .score-section {
      text-align: center;
      margin: 40px 0;
      padding: 30px;
      background: rgba(255, 215, 0, 0.1);
      border-radius: 12px;
      border: 2px solid #FFD700;
    }
    .total-score {
      font-size: 72px;
      font-weight: bold;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
    }
    .score-label {
      font-size: 18px;
      color: #9ca3af;
      margin-top: 10px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    .metric {
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .metric-name {
      font-size: 14px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    .metric-score {
      font-size: 32px;
      font-weight: bold;
      color: #FFD700;
    }
    .insights {
      margin-top: 30px;
    }
    .insights-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #FFD700;
    }
    .insight {
      background: rgba(255, 255, 255, 0.05);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 3px solid #FFD700;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
    @media print {
      body { background: #0B1221; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">👑 Dominion Marketing</div>
      <div class="date">${date}</div>
    </div>

    <div class="business-info">
      <div class="business-name">${data.businessName}</div>
      <a href="${data.websiteURL}" class="website" target="_blank">${data.websiteURL}</a>
    </div>

    <div class="score-section">
      <div class="total-score">${data.totalScore}</div>
      <div class="score-label">AI Presence Score</div>
    </div>

    <div class="metrics">
      <div class="metric">
        <div class="metric-name">Performance</div>
        <div class="metric-score">${data.performance}</div>
      </div>
      <div class="metric">
        <div class="metric-name">SEO</div>
        <div class="metric-score">${data.seo}</div>
      </div>
      <div class="metric">
        <div class="metric-name">Tech Depth</div>
        <div class="metric-score">${data.techDepth}</div>
      </div>
      <div class="metric">
        <div class="metric-name">Visibility</div>
        <div class="metric-score">${data.visibility}</div>
      </div>
    </div>

    <div class="insights">
      <div class="insights-title">Recommendations</div>
      ${data.insights.map((insight) => `<div class="insight">${insight}</div>`).join("")}
    </div>

    <div class="footer">
      <p>This report was generated by Dominion Marketing's AI Presence Checker.</p>
      <p>For a comprehensive audit and custom growth plan, contact us today.</p>
    </div>
  </div>
</body>
</html>
  `
}
