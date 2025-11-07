"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [scrollDepth, setScrollDepth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      setScrollDepth(scrollPercentage)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && scrollDepth >= 40) {
        setShowPopup(true)
        setHasShown(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [hasShown, scrollDepth])

  const handleClose = () => {
    setShowPopup(false)
    setTimeout(() => {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
    }, 500)
  }

  const handleRunAudit = () => {
    setShowPopup(false)
    const auditSection = document.getElementById("score")
    if (auditSection) {
      auditSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            style={{
              background: "radial-gradient(circle at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.92) 100%)",
              backdropFilter: "blur(8px)",
            }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, filter: "blur(6px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0)" }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-2xl p-8 transition-transform duration-300 hover:perspective-1000"
              style={{
                background: "linear-gradient(180deg, #0E1013 0%, #0B0C10 100%)",
                border: "2px solid #FFD700",
                boxShadow: "0 0 25px rgba(255, 217, 90, 0.3)",
                animation: "auraPulse 6s ease-in-out infinite",
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
                e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 1}deg) rotateX(${-y * 1}deg)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-20"
                style={{
                  background:
                    "radial-gradient(circle at 20% 30%, rgba(255, 217, 90, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 217, 90, 0.06) 0%, transparent 50%)",
                  filter: "blur(2px)",
                }}
              />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#FFD700] text-2xl font-bold transition z-10"
                aria-label="Close popup"
              >
                ×
              </button>

              {/* Content */}
              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD700]/20 mb-4 animate-pulse-ring">
                  <span className="text-4xl">⚡</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 font-sans leading-tight">
                  Wait — your AI competitor score is ready to run.
                </h2>

                <p className="text-[#FFD700] text-sm font-medium mb-3 font-sans">
                  Free audit. No signup. Instant results.
                </p>

                <p className="text-gray-300 text-base mb-6 font-sans leading-relaxed">
                  See how many customers your competitors are capturing before you close this tab.
                </p>

                <button
                  onClick={handleRunAudit}
                  className="relative w-full bg-[#FFD700] text-gray-900 font-semibold py-4 rounded-xl overflow-hidden group transition-all duration-300 mb-3 font-sans hover:scale-105"
                  style={{
                    boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
                    animation: "buttonBreath 5s ease-in-out infinite",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 35px rgba(255, 215, 0, 0.7)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.4)"
                  }}
                >
                  <span
                    className="absolute top-0 left-0 w-1/2 h-full pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255, 217, 90, 0.3), transparent)",
                      animation: "buttonShimmerSweep 5s ease-in-out infinite",
                      left: "-100%",
                    }}
                  />
                  <span className="relative z-10">Run Free Audit Now</span>

                  <span
                    className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: "0 0 40px rgba(255, 217, 90, 0.4)",
                      animation: "ringSpread 0.8s ease-out",
                    }}
                  />
                </button>

                <p className="text-gray-500 text-xs mb-3 font-sans">Trusted by 1,200+ local businesses.</p>

                <button
                  onClick={handleClose}
                  className="text-gray-400 text-sm hover:text-gray-300 transition font-sans"
                >
                  No thanks, I'll pass
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[101] bg-[#0E1013] border border-[#FFD700]/50 rounded-xl px-6 py-4 shadow-lg max-w-xs"
          >
            <p className="text-white text-sm font-sans">
              You can still get your free audit anytime — no signup needed.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
