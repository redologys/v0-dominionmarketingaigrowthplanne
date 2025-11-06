import jsPDF from "jspdf"

interface ReportData {
  businessName: string
  mode: "website" | "social"
  websiteURL?: string
  socialHandles?: {
    instagram?: string
    tiktok?: string
    facebook?: string
    linkedin?: string
  }
  overallScore: number
  breakdown: any[]
  summary?: string
  recommendations?: string[]
  percentile?: number
  yelpRating?: number
  googleRating?: number
  nycVerified?: boolean
  sources?: Record<string, boolean>
}

export const generateReport = (data: ReportData) => {
  const doc = new jsPDF()

  const pageHeight = 297 // A4 page height in mm
  const marginBottom = 20 // Bottom margin
  let currentY = 0 // Track current Y position

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - marginBottom) {
      doc.addPage()
      currentY = 15 // Reset Y position with top margin
      return true
    }
    return false
  }

  // Dominion branding colors
  const navyRGB = [11, 18, 33] // #0B1221
  const goldRGB = [255, 215, 0] // #FFD700
  const grayRGB = [184, 184, 184] // #B8B8B8

  doc.setFillColor(0, 0, 0)
  doc.rect(0, 0, 210, 45, "F")

  // Crown icon
  doc.setTextColor(...goldRGB)
  doc.setFontSize(28)
  doc.text("♔", 15, 22)

  // Title
  doc.setFont("helvetica", "bold")
  doc.setFontSize(22)
  doc.setTextColor(...goldRGB)
  doc.text("Dominion Marketing", 35, 20)

  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text("AI Business Audit Report", 35, 30)

  // Generation date
  doc.setFontSize(9)
  doc.setTextColor(...grayRGB)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 35, 37)

  currentY = 60

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(`Business: ${data.businessName}`, 15, currentY)
  currentY += 8

  if (data.mode === "website" && data.websiteURL) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.text(`Website: ${data.websiteURL}`, 15, currentY)
    currentY += 10
  } else if (data.mode === "social" && data.socialHandles) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    if (data.socialHandles.instagram) {
      doc.text(`Instagram: @${data.socialHandles.instagram}`, 15, currentY)
      currentY += 7
    }
    if (data.socialHandles.tiktok) {
      doc.text(`TikTok: @${data.socialHandles.tiktok}`, 15, currentY)
      currentY += 7
    }
    if (data.socialHandles.facebook) {
      doc.text(`Facebook: ${data.socialHandles.facebook}`, 15, currentY)
      currentY += 7
    }
    if (data.socialHandles.linkedin) {
      doc.text(`LinkedIn: ${data.socialHandles.linkedin}`, 15, currentY)
      currentY += 7
    }
  }

  currentY += 10
  checkPageBreak(50)

  const scoreY = currentY
  doc.setDrawColor(...goldRGB)
  doc.setLineWidth(4)
  doc.circle(40, scoreY, 22, "S")

  doc.setFontSize(36)
  doc.setTextColor(...goldRGB)
  doc.setFont("helvetica", "bold")
  doc.text(String(data.overallScore), 40, scoreY + 6, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("Overall Score", 40, scoreY + 18, { align: "center" })

  const percentile = data.percentile || Math.min(95, Math.max(5, data.overallScore))
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "bold")
  doc.text("AI Summary:", 80, scoreY - 10)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  const strength =
    data.overallScore > 80
      ? "Your business has a strong digital foundation, outperforming most competitors."
      : data.overallScore > 65
        ? "Solid foundation — a few targeted improvements could significantly boost visibility."
        : "Your digital foundation has key gaps that limit your visibility and customer trust."

  const summaryLines = doc.splitTextToSize(strength, 110)
  doc.text(summaryLines, 80, scoreY - 3)

  const summaryHeight = summaryLines.length * 5
  doc.setTextColor(100, 100, 100)
  doc.text(`Percentile: You rank higher than ${percentile}% of businesses.`, 80, scoreY - 3 + summaryHeight + 3)

  currentY = scoreY + 35

  if (
    (data.yelpRating !== undefined && data.yelpRating > 0) ||
    (data.googleRating !== undefined && data.googleRating > 0)
  ) {
    checkPageBreak(25)

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Reputation Insights:", 15, currentY)
    currentY += 7

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const avgRep = Math.round(((data.yelpRating || 0) + (data.googleRating || 0)) / 2)
    doc.text(`⭐ Average Reputation Score: ${avgRep}/100`, 15, currentY)
    currentY += 6

    if (avgRep < 70) {
      const recText = "Recommendation: Actively request more Google and Yelp reviews to strengthen credibility."
      const recLines = doc.splitTextToSize(recText, 180)
      doc.text(recLines, 15, currentY)
      currentY += recLines.length * 5
    } else {
      const recText = "Reputation looks good — maintain engagement and respond to reviews regularly."
      const recLines = doc.splitTextToSize(recText, 180)
      doc.text(recLines, 15, currentY)
      currentY += recLines.length * 5
    }
    currentY += 5
  }

  if (data.nycVerified !== undefined) {
    checkPageBreak(15)

    doc.setFontSize(10)
    if (data.nycVerified) {
      doc.setTextColor(0, 128, 0)
      doc.text("✓ Verified on NYC Open Data registry — adds local authority.", 15, currentY)
    } else {
      doc.setTextColor(200, 100, 0)
      doc.text("⚠ Not listed in NYC registry. Verification can increase local search rankings.", 15, currentY)
    }
    currentY += 10
  }

  checkPageBreak(20)

  doc.setFontSize(15)
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "bold")
  doc.text("Detailed Breakdown", 15, currentY)
  currentY += 10

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  const breakdownDetails: Record<string, string> = {
    Performance: "Site speed, Core Web Vitals, and loading times",
    SEO: "Meta tags, structured data, and keyword optimization",
    Accessibility: "Mobile-friendliness and ADA compliance",
    "Social Presence": "Instagram, Facebook, TikTok consistency",
    "Local Visibility": "Google Maps, citations, and local reviews",
    Reputation: "Sentiment score from public reviews",
    "Brand Cohesion": "Visual identity and tone consistency",
    "Business Verification": "Official registration and legitimacy",
  }

  data.breakdown.forEach((item) => {
    checkPageBreak(25)

    const score = "score" in item ? item.score : 0
    const label = "area" in item ? item.area : "platform" in item ? item.platform : "Unknown"
    const explanation = breakdownDetails[label] || item.feedback || "Analysis complete"
    const tenScale =
      "tenScale" in item ? item.tenScale : Math.min(10, Math.max(1, Number.parseFloat((score / 10).toFixed(1))))

    // Label
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")
    doc.text(label, 15, currentY)

    // Explanation
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(explanation, 15, currentY + 5)

    // Bar background
    doc.setFillColor(230, 230, 230)
    doc.rect(15, currentY + 8, 140, 5, "F")

    // Bar fill (gold)
    const barWidth = (score / 100) * 140
    doc.setFillColor(...goldRGB)
    doc.rect(15, currentY + 8, barWidth, 5, "F")

    // Score text
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")
    doc.text(`${score}%`, 160, currentY + 11)

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.setFont("helvetica", "normal")
    doc.text(`(${tenScale}/10)`, 175, currentY + 11)

    currentY += 20
  })

  currentY += 10
  checkPageBreak(20)

  doc.setFontSize(15)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("Personalized Actions", 15, currentY)
  currentY += 10

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  const recommendations = data.recommendations || []
  const rankedRecs = recommendations.slice(0, 5)

  if (rankedRecs.length === 0) {
    doc.setTextColor(0, 128, 0)
    doc.text("No major issues found. Maintain your strong digital presence.", 15, currentY)
    currentY += 10
  } else {
    rankedRecs.forEach((rec, index) => {
      const lines = doc.splitTextToSize(`⚙️ ${rec}`, 170)
      const requiredSpace = lines.length * 5 + 2
      checkPageBreak(requiredSpace + 5)

      doc.setTextColor(0, 102, 255) // Soft blue for AI consultant feel
      doc.text(lines, 15, currentY)
      doc.setTextColor(0, 0, 0) // Reset to black
      currentY += requiredSpace + 3
    })
  }

  currentY += 5

  const lowerName = data.businessName.toLowerCase()
  let businessInsight = ""

  if (
    lowerName.includes("restaurant") ||
    lowerName.includes("pizza") ||
    lowerName.includes("cafe") ||
    lowerName.includes("bistro")
  ) {
    businessInsight = "🍽 Restaurant Insight: Add food photography, menu keywords, and ensure mobile menu optimization."
  } else if (lowerName.includes("law") || lowerName.includes("attorney") || lowerName.includes("legal")) {
    businessInsight = "⚖ Law Firm Insight: Highlight legal specialties and client testimonials for credibility."
  } else if (lowerName.includes("gym") || lowerName.includes("fitness") || lowerName.includes("yoga")) {
    businessInsight = "🏋 Fitness Insight: Emphasize Google posts and local map check-ins to attract new members."
  } else if (lowerName.includes("salon") || lowerName.includes("spa") || lowerName.includes("beauty")) {
    businessInsight = "💇 Beauty Insight: Showcase before/after photos and encourage client reviews on Google."
  }

  if (businessInsight) {
    checkPageBreak(15)
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 139)
    doc.setFont("helvetica", "bold")
    const insightLines = doc.splitTextToSize(businessInsight, 180)
    doc.text(insightLines, 15, currentY)
    currentY += insightLines.length * 5 + 5
  }

  if (data.sources && Object.keys(data.sources).length > 0) {
    checkPageBreak(30)

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text("Data Sources Used:", 15, currentY)
    currentY += 7

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)

    Object.entries(data.sources).forEach(([name, used]) => {
      if (used) {
        checkPageBreak(5)
        doc.text(`• ${name}`, 15, currentY)
        currentY += 5
      }
    })
    currentY += 5
  }

  const ctaHeight = 20
  const footerHeight = 12
  const totalFooterSpace = ctaHeight + footerHeight + 5

  if (currentY + totalFooterSpace > pageHeight - marginBottom) {
    doc.addPage()
    currentY = pageHeight - totalFooterSpace - marginBottom
  } else {
    currentY = pageHeight - totalFooterSpace - marginBottom
  }

  doc.setFillColor(...goldRGB)
  doc.rect(0, currentY, 210, ctaHeight, "F")

  doc.setFontSize(12)
  doc.setTextColor(...navyRGB)
  doc.setFont("helvetica", "bold")
  doc.text("Want a personalized audit and strategy roadmap?", 15, currentY + 8)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Consult with Dominion Marketing", 15, currentY + 14)

  doc.setTextColor(0, 0, 139)
  doc.textWithLink("instagram.com/dominion.marketing", 90, currentY + 14, {
    url: "https://www.instagram.com/dominion.marketing",
  })

  currentY += ctaHeight + 5

  doc.setFillColor(...navyRGB)
  doc.rect(0, currentY, 210, footerHeight, "F")

  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "normal")
  doc.text("Powered by Dominion Marketing", 15, currentY + 7)

  // Save the PDF
  const filename =
    data.mode === "website"
      ? `${data.businessName.replace(/\s+/g, "-")}-Dominion-Report.pdf`
      : `${data.businessName.replace(/\s+/g, "-")}-Social-Report.pdf`

  doc.save(filename)
}
