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
              background: "radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)",
              backdropFilter: "blur(12px)",
            }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-3xl p-10 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(18,20,25,0.98) 0%, rgba(12,14,18,0.99) 100%)",
                border: "2px solid rgba(255,215,0,0.5)",
                boxShadow:
                  "0 0 60px rgba(255,215,0,0.25), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)",
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
                e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 1.5}deg) rotateX(${-y * 1.5}deg)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)"
                e.currentTarget.style.transition = "transform 0.5s ease-out"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient glow overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  background: "radial-gradient(ellipse at top, rgba(255,215,0,0.1) 0%, transparent 50%)",
                }}
              />

              {/* Animated ambient glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 20% 30%, rgba(255,215,0,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,215,0,0.1) 0%, transparent 40%)",
                  animation: "auraPulse 6s ease-in-out infinite",
                }}
              />

              <button
                onClick={handleClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/50 hover:bg-[#FFD700]/10 text-xl font-bold transition-all duration-300 z-10"
                aria-label="Close popup"
              >
                ×
              </button>

              {/* Content */}
              <div className="text-center relative z-10">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.05) 100%)",
                    boxShadow: "0 0 30px rgba(255,215,0,0.3), inset 0 0 20px rgba(255,215,0,0.1)",
                    animation: "pulseGlow 3s ease-in-out infinite",
                  }}
                >
                  <span className="text-5xl">⚡</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  Wait — your AI competitor score is ready to run.
                </h2>

                <p
                  className="text-base font-semibold mb-4"
                  style={{
                    background: "linear-gradient(90deg, #FFD700, #FFC000)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Free audit. No signup. Instant results.
                </p>

                <p className="text-gray-400 text-base mb-8 leading-relaxed">
                  See how many customers your competitors are capturing before you close this tab.
                </p>

                <button
                  onClick={handleRunAudit}
                  className="relative w-full bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-gray-900 font-bold py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 mb-4"
                  style={{
                    boxShadow: "0 0 30px rgba(255,215,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 50px rgba(255,215,0,0.6), inset 0 1px 1px rgba(255,255,255,0.3)"
                    e.currentTarget.style.transform = "scale(1.02)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 30px rgba(255,215,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3)"
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                >
                  {/* Shimmer sweep effect */}
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
                      animation: "shimmerSweep 3s ease-in-out infinite",
                    }}
                  />
                  <span className="relative z-10 text-lg">Run Free Audit Now</span>
                </button>

                <p className="text-gray-500 text-sm mb-4">Trusted by 1,200+ local businesses.</p>

                <button
                  onClick={handleClose}
                  className="text-gray-500 text-sm hover:text-gray-300 transition-colors duration-300 underline underline-offset-2"
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[101] rounded-xl px-6 py-4 max-w-xs"
            style={{
              background: "linear-gradient(135deg, rgba(18,20,25,0.95) 0%, rgba(12,14,18,0.98) 100%)",
              border: "1px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 30px rgba(255,215,0,0.15), 0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            <p className="text-white text-sm">You can still get your free audit anytime — no signup needed.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
