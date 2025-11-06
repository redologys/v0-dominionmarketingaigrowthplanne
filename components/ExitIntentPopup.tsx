"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const ExitIntentPopup = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves from the top of the viewport
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true)
        setHasShown(true)
      }
    }

    const handleScroll = () => {
      // Also trigger on rapid upward scroll
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > 100) {
        const prevScrollTop = Number.parseInt(sessionStorage.getItem("prevScrollTop") || "0")
        if (prevScrollTop - scrollTop > 100 && !hasShown) {
          setShowPopup(true)
          setHasShown(true)
        }
        sessionStorage.setItem("prevScrollTop", scrollTop.toString())
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("scroll", handleScroll)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasShown])

  const handleClose = () => {
    setShowPopup(false)
  }

  const handleRunAudit = () => {
    setShowPopup(false)
    const auditSection = document.getElementById("score")
    if (auditSection) {
      auditSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#0E1425] border-2 border-[#FFD700] rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.3)] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#FFD700] text-2xl font-bold transition"
              aria-label="Close popup"
            >
              ×
            </button>

            {/* Content */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD700]/20 mb-4">
                <span className="text-4xl">⚡</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3 font-sans">
                Leaving without checking your competitor score?
              </h2>

              <p className="text-gray-300 text-base mb-6 font-sans leading-relaxed">
                Run it free — no signup needed. See exactly where you stand against your competition in under 60
                seconds.
              </p>

              <button
                onClick={handleRunAudit}
                className="w-full bg-[#FFD700] text-gray-900 font-semibold py-4 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:scale-105 transition-all duration-300 mb-3 font-sans"
              >
                Run Free Audit Now
              </button>

              <button onClick={handleClose} className="text-gray-400 text-sm hover:text-gray-300 transition font-sans">
                No thanks, I'll pass
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
