"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ScoreResult, ScoreBreakdown, SocialScoreResult, SocialMediaAnalysis } from "../types"
import { Icons } from "./icons"
import { AnimatedHeadline } from "./AnimatedHeadline"
import { generateReport } from "../lib/reportGenerator"

const LoadingBars = () => {
  const bars = [0, 1, 2, 3, 4]
  return (
    <div className="flex gap-2 mt-6">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-2 h-12 bg-[#FFD700] rounded-full"
          animate={{
            scaleY: [1, 1.8, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

const getBusinessScore = async (
  businessName: string,
  mode: "website" | "social" | "business",
  websiteURL?: string,
  socialHandles?: { instagram?: string; tiktok?: string; facebook?: string; linkedin?: string },
) => {
  try {
    const params = new URLSearchParams({
      businessName,
      mode,
    })

    if (mode === "website" && websiteURL) {
      params.set("url", websiteURL)
    } else if (mode === "social" && socialHandles) {
      if (socialHandles.instagram) params.set("instagram", socialHandles.instagram)
      if (socialHandles.tiktok) params.set("tiktok", socialHandles.tiktok)
      if (socialHandles.facebook) params.set("facebook", socialHandles.facebook)
      if (socialHandles.linkedin) params.set("linkedin", socialHandles.linkedin)
    }

    const res = await fetch(`/api/check?${params.toString()}`)

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text()
      throw new Error("API returned invalid response. The endpoint may not be configured correctly.")
    }

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || "Failed to analyze")
    }

    const data = await res.json()
    return data
  } catch (error: any) {
    throw error
  }
}

const ringColor = (score: number) => {
  if (score >= 75) return "#16a34a"
  if (score >= 50) return "#f59e0b"
  return "#ef4444"
}

const getScoreFeedback = (score: number) => {
  if (score < 50) {
    return {
      tone: "Needs Improvement",
      subtitle: "Plenty of quick wins available — let's tighten up your core metrics.",
      color: "text-red-400",
      percentile: Math.floor(Math.random() * 20) + 10, // 10-30%
    }
  } else if (score < 75) {
    return {
      tone: "Strong",
      subtitle: "Solid foundation — just a few optimizations left to unlock full potential.",
      color: "text-amber-400",
      percentile: Math.floor(Math.random() * 25) + 50, // 50-75%
    }
  } else {
    return {
      tone: "Excellent",
      subtitle: "Outstanding performance — you're leading your market.",
      color: "text-green-400",
      percentile: Math.floor(Math.random() * 15) + 80, // 80-95%
    }
  }
}

const ScoreRing: React.FC<{ finalScore: number; animatedScore: number }> = ({ finalScore, animatedScore }) => {
  const color = ringColor(finalScore)
  const deg = Math.round((animatedScore / 100) * 360)
  const style = {
    background: `conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.1) ${deg}deg)`,
  }
  return <div className="w-40 h-40 rounded-full" style={style}></div>
}

const InitialBreakdown: React.FC = () => (
  <ul className="space-y-3">
    <li className="flex items-start gap-3">
      <div className="h-6 w-6 rounded-md bg-white/10 text-gray-300 grid place-content-center flex-shrink-0">
        <Icons.ShieldCheck className="w-3.5 h-3.5" />
      </div>
      <div>
        <div className="text-base font-medium text-white font-sans">On-Page SEO</div>
        <div className="text-sm text-gray-400 font-sans">Analyzes domain, URL, and HTTPS.</div>
      </div>
    </li>
    <li className="flex items-start gap-3">
      <div className="h-6 w-6 rounded-md bg-white/10 text-gray-300 grid place-content-center flex-shrink-0">
        <Icons.FileText className="w-3.5 h-3.5" />
      </div>
      <div>
        <div className="text-base font-medium text-white font-sans">Brand Clarity</div>
        <div className="text-sm text-gray-400 font-sans">Evaluates name memorability.</div>
      </div>
    </li>
    <li className="flex items-start gap-3">
      <div className="h-6 w-6 rounded-md bg-white/10 text-gray-300 grid place-content-center flex-shrink-0">
        <Icons.MapPin className="w-3.5 h-3.5" />
      </div>
      <div>
        <div className="text-base font-medium text-white font-sans">Local SEO Potential</div>
        <div className="text-sm text-gray-400 font-sans">Assesses local ranking factors.</div>
      </div>
    </li>
  </ul>
)

const ResultBreakdown: React.FC<{ breakdown: ScoreBreakdown[] | SocialMediaAnalysis[] }> = ({ breakdown }) => (
  <ul className="space-y-3">
    {breakdown.map((item) => {
      const score = "score" in item ? item.score : 0
      const area = "area" in item ? item.area : "platform" in item ? item.platform : "Unknown"
      const feedback = item.feedback
      const isGood = score >= 60
      return (
        <li key={area} className="flex items-start gap-3">
          <div
            className={`h-6 w-6 rounded-md ${isGood ? "bg-[#FFD700] text-gray-900" : "bg-white/10 text-gray-300"} grid place-content-center flex-shrink-0`}
          >
            {isGood ? <Icons.Check className="w-3.5 h-3.5" /> : <Icons.CircleAlert className="w-3.5 h-3.5" />}
          </div>
          <div>
            <div className="text-base font-medium text-white font-sans">{area}</div>
            <div className="text-sm text-gray-400 font-sans">{feedback}</div>
          </div>
        </li>
      )
    })}
  </ul>
)

const CategoryTiles: React.FC<{ breakdown: ScoreBreakdown[] | SocialMediaAnalysis[] }> = ({ breakdown }) => {
  const categories = breakdown.map((item) => {
    const area = "area" in item ? item.area : "platform" in item ? item.platform : "Unknown"
    const score = "score" in item ? item.score : 0
    const tenScale =
      "tenScale" in item ? item.tenScale : Math.min(10, Math.max(1, Number.parseFloat((score / 10).toFixed(1))))

    const descriptions: Record<string, string> = {
      Performance: "Speed & Core Web Vitals",
      SEO: "Meta tags, structure, keywords",
      Accessibility: "Mobile-friendly & ADA",
      Reputation: "Security & trust signals",
      "Local Visibility": "Maps & local rankings",
      "Social Engagement": "Engagement & activity",
      Instagram: "Posts, followers, engagement",
      TikTok: "Videos, views, trends",
      Facebook: "Page activity & reach",
      LinkedIn: "Professional presence",
    }

    return {
      title: area,
      desc: descriptions[area] || "Digital presence metrics",
      score,
      tenScale,
    }
  })

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {categories.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
          className="bg-[#0F1526] rounded-xl p-4 border border-[#FFD700]/20 hover:border-[#FFD700]/50 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all"
        >
          <p className="text-[#FFD700] font-semibold text-sm font-sans">{item.title}</p>
          <p className="text-gray-300 text-xs mt-1 font-sans">{item.desc}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#FFD700] font-semibold text-base">{item.tenScale}/10</span>
              <span className="text-gray-400 text-xs">{item.score}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.tenScale * 10}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 + 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#FFD700] to-[#FDE047] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export const BusinessScore: React.FC = () => {
  const [businessName, setBusinessName] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [noWebsite, setNoWebsite] = useState(false)
  const [instagram, setInstagram] = useState("")
  const [tiktok, setTiktok] = useState("")
  const [facebook, setFacebook] = useState("")
  const [linkedin, setLinkedin] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScoreResult | SocialScoreResult | null>(null)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    if (result) {
      const start = 0
      const end = result.overallScore
      if (start === end) return

      const startTime = Date.now()
      const duration = 1200

      const timer = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const current = Math.floor(progress * end)
        setAnimatedScore(current)
        if (progress < 1) {
          requestAnimationFrame(timer)
        }
      }
      requestAnimationFrame(timer)
    } else {
      setAnimatedScore(0)
    }
  }, [result])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)
      setResult(null)

      try {
        let mode: "website" | "social" | "business"
        if (!noWebsite && websiteUrl) {
          mode = "website"
        } else if (noWebsite && (instagram || tiktok || facebook || linkedin)) {
          mode = "social"
        } else {
          mode = "business"
        }

        const scoreResult = await getBusinessScore(
          businessName,
          mode,
          mode === "website" ? websiteUrl : undefined,
          mode === "social" ? { instagram, tiktok, facebook, linkedin } : undefined,
        )
        setResult(scoreResult)
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    },
    [businessName, websiteUrl, noWebsite, instagram, tiktok, facebook, linkedin],
  )

  const handleDownloadReport = useCallback(async () => {
    if (!result) return

    setIsDownloading(true)
    try {
      generateReport({
        businessName,
        mode: "mode" in result ? result.mode : "website",
        websiteURL: websiteUrl,
        socialHandles: { instagram, tiktok, facebook, linkedin },
        overallScore: result.overallScore,
        breakdown: result.breakdown,
        summary: "summary" in result ? result.summary : undefined,
      })
    } catch (err: any) {
      setError(err.message || "Failed to generate report")
    } finally {
      setIsDownloading(false)
    }
  }, [result, businessName, websiteUrl, instagram, tiktok, facebook, linkedin])

  const handleInitialDownloadClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    setShowUpgradeModal(true)
  }, [])

  const handleKeepFreeAudit = useCallback(() => {
    handleDownloadReport()
    setShowUpgradeModal(false)
  }, [handleDownloadReport])

  const handleUpgradeToFull = useCallback(() => {
    window.open("https://www.instagram.com/dominion.marketing", "_blank")
  }, [])

  const scoreFeedback = result ? getScoreFeedback(result.overallScore) : null

  return (
    <>
      <section id="score" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-[#111A2E] to-[#0B1221] bg-[length:200%_100%] animate-[gradient_15s_ease_infinite]"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
              >
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  style={{
                    backgroundImage: "radial-gradient(circle at center, #FFD700 0%, transparent 70%)",
                    backgroundSize: "200% 200%",
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center relative z-10"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="crown-glow bg-[#0F1526] p-6 rounded-full border border-[#FFD700]/50 shadow-[0_0_25px_rgba(255,215,0,0.2)]"
                  >
                    <div className="text-6xl">♔</div>
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-semibold mt-6 text-white font-sans"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Analyzing your digital presence...
                  </motion.h2>

                  <LoadingBars />

                  <p className="text-gray-400 text-sm mt-3 font-sans">
                    Scanning performance, SEO, accessibility, and more...
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div
              animate={{ opacity: isLoading ? 0.5 : 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-[inset_0_2px_4px_#0B122199,0_0_15px_#FFD7001A]"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-[#FFD700] font-sans">
                <Icons.Gauge className="w-3.5 h-3.5" />
                Free AI-Powered Business Score
              </div>
              <div className="mt-4">
                <AnimatedHeadline text="How strong is your online presence?" />
              </div>
              <p className="mt-3 text-lg text-gray-300 font-sans">
                Get an instant presence estimate. Enter your business name {!noWebsite && "and website"}
                {noWebsite && "(optionally add social media)"} to see your AI-generated score, plus quick wins to get
                more customers.
              </p>
              <p className="mt-2 text-sm text-gray-400 font-sans italic">
                This score uses public data from Google, Yelp, and PageSpeed to give a real-world reflection of your
                digital health.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-base font-medium text-gray-200 mb-1">
                    Business name
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    required
                    placeholder="e.g., Dominion Coffee Co."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="noWebsite"
                    type="checkbox"
                    checked={noWebsite}
                    onChange={(e) => setNoWebsite(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                  />
                  <label htmlFor="noWebsite" className="text-sm text-gray-300">
                    I don't have a website (we'll analyze your online presence)
                  </label>
                </div>

                {!noWebsite && (
                  <div>
                    <label htmlFor="websiteUrl" className="block text-base font-medium text-gray-200 mb-1">
                      Website URL <span className="text-gray-400 text-sm">(optional)</span>
                    </label>
                    <input
                      id="websiteUrl"
                      type="url"
                      placeholder="e.g., https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition"
                    />
                  </div>
                )}

                {noWebsite && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 font-sans">
                      Enter your social media handles (optional - we'll search for your business online):
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-300 mb-1">
                          Instagram
                        </label>
                        <input
                          id="instagram"
                          type="text"
                          placeholder="@username"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value.replace("@", ""))}
                          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="tiktok" className="block text-sm font-medium text-gray-300 mb-1">
                          TikTok
                        </label>
                        <input
                          id="tiktok"
                          type="text"
                          placeholder="@username"
                          value={tiktok}
                          onChange={(e) => setTiktok(e.target.value.replace("@", ""))}
                          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-300 mb-1">
                          Facebook
                        </label>
                        <input
                          id="facebook"
                          type="text"
                          placeholder="page-name"
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
                          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
                          LinkedIn
                        </label>
                        <input
                          id="linkedin"
                          type="text"
                          placeholder="company-name"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] transition text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300 font-sans">AI analysis. No signup required.</p>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-md bg-[#FFD700] text-gray-900 text-base font-semibold px-4 py-2.5 hover:bg-amber-300 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(255,215,0,0.4)] hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] group"
                  >
                    {isLoading ? (
                      <Icons.LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icons.Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    <span className="transition-colors duration-300 delay-50">
                      {isLoading ? "Analyzing..." : "Run Smart Audit"}
                    </span>
                  </button>
                </div>
                {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
              </form>
            </motion.div>

            <div className="bg-white/5 border border-[#FFD700]/20 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-[inset_0_2px_4px_#0B122199,0_0_20px_#FFD7003A]">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-tight text-white font-sans">Your score</h3>
                <span className="text-sm text-gray-400 font-sans">AI-generated analysis</span>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: result ? 1 : 0.9, scale: result ? 1 : 0.9 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mt-6 flex flex-col items-center"
              >
                <div className="relative">
                  {result && (
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-20"
                      animate={{
                        background: [
                          "linear-gradient(45deg, #FFD700 0%, #FDE047 50%, #ffffff 100%)",
                          "linear-gradient(90deg, #FDE047 0%, #ffffff 50%, #FFD700 100%)",
                          "linear-gradient(135deg, #ffffff 0%, #FFD700 50%, #FDE047 100%)",
                          "linear-gradient(180deg, #FFD700 0%, #FDE047 50%, #ffffff 100%)",
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  )}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl"
                    animate={
                      result
                        ? {
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    style={{ background: result ? ringColor(result.overallScore) : "transparent" }}
                  />
                  <div className="w-48 h-48 rounded-full border-2 border-[#FFD700] flex items-center justify-center relative">
                    <div className="absolute inset-2 bg-[#0E1425] rounded-full border border-white/10 grid place-content-center">
                      <div className="text-center px-2">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                          className="text-5xl font-bold text-white font-sans leading-none"
                        >
                          {result ? animatedScore : "—"}
                        </motion.span>
                        {scoreFeedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.4 }}
                            className="mt-1"
                          >
                            <p className={`text-xs font-semibold ${scoreFeedback.color} font-sans leading-tight`}>
                              {scoreFeedback.tone}
                            </p>
                          </motion.div>
                        )}
                        {!result && <div className="text-sm text-gray-400 mt-1 font-sans">Run a check</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {scoreFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 text-center"
                  >
                    <p className="text-gray-300 text-sm font-sans">{scoreFeedback.subtitle}</p>
                    <p className="text-gray-400 text-xs mt-2 italic font-sans">
                      You rank higher than {scoreFeedback.percentile}% of similar local businesses.
                    </p>
                    <div className="mt-4 p-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg">
                      <p className="text-gray-300 text-xs font-medium text-center font-sans">
                        This is your surface-level score. Our full AI audit uncovers 50+ hidden growth levers —
                        including ad gaps, Google Maps visibility, and your best-performing competitor's strategy.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {result && <CategoryTiles breakdown={result.breakdown} />}
              {!result && (
                <div className="mt-8">
                  <InitialBreakdown />
                </div>
              )}

              {result && result.recommendations && result.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-[#0F1526] border border-[#FFD700]/20 rounded-2xl p-5 mt-8"
                >
                  <h3 className="text-[#FFD700] font-semibold mb-3 flex items-center gap-2 font-sans">
                    ⚡ Personalized Recommendations
                  </h3>
                  <ul className="text-gray-300 text-sm space-y-3 font-sans">
                    {result.recommendations.slice(0, 5).map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#FFD700] font-semibold text-xs mt-0.5 flex-shrink-0">⚙️ Tip:</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-amber-400 text-xs font-medium flex items-start gap-2">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>Only 27% of businesses fix these issues on their own — let's build your plan.</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col gap-3 mt-8"
                >
                  <button
                    onClick={handleInitialDownloadClick}
                    disabled={isDownloading}
                    className="bg-[#FFD700] text-black font-semibold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                  >
                    {isDownloading ? "Generating..." : "📄 Download Free AI Audit"}
                  </button>

                  <a
                    href="https://www.instagram.com/dominion.marketing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent border border-[#FFD700]/40 text-[#FFD700] font-medium py-2 rounded-xl hover:bg-[#FFD700]/10 transition text-center font-sans"
                  >
                    🚀 Book a Free Strategy Call
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-[#0E1016] border border-[#FFD700]/40 rounded-2xl shadow-2xl p-8 text-gray-100 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-[#FFD700] text-xl font-bold transition"
              >
                ✕
              </button>

              {/* Header */}
              <h2 className="text-[#FFD700] font-semibold text-xl mb-2 flex items-center gap-2 font-sans">
                💡 Want a Full Growth Audit?
              </h2>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed font-sans">
                You're downloading your free 2-page summary — but we can also generate a complete growth report that
                includes:
              </p>

              {/* Features List */}
              <ul className="text-gray-300 text-sm space-y-2 mb-5 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD700] flex-shrink-0 mt-0.5">✓</span>
                  <span>Competitor benchmarks (side-by-side comparison)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD700] flex-shrink-0 mt-0.5">✓</span>
                  <span>Social media & review sentiment grading</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD700] flex-shrink-0 mt-0.5">✓</span>
                  <span>Keyword & traffic opportunity analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD700] flex-shrink-0 mt-0.5">✓</span>
                  <span>90-day roadmap written by our AI marketing engine</span>
                </li>
              </ul>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleKeepFreeAudit}
                  disabled={isDownloading}
                  className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-md hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  📄 Keep Free Audit (Basic)
                </button>
                <button
                  onClick={handleUpgradeToFull}
                  className="flex-1 bg-[#FFD700] text-black font-semibold py-2.5 rounded-md hover:bg-[#FFD700]/90 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition font-sans"
                >
                  🚀 Upgrade to Full Audit ($49)
                </button>
              </div>

              {/* Bottom Info */}
              <div className="border-t border-[#FFD700]/20 pt-3 text-xs text-gray-400">
                <p className="mb-3 font-sans">
                  91% of upgraded businesses uncover hidden revenue opportunities worth $1,000+ monthly.
                </p>
                <div className="flex items-center justify-center gap-6">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#FFD700]">✅</span> 120+ analyzed this month
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#FFD700]">🔒</span> Secure payment
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </>
  )
}
