"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToAudit = () => {
    const auditSection = document.getElementById("score")
    if (auditSection) {
      auditSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToAudit}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-3 text-sm font-semibold text-gray-900 shadow-[0_4px_20px_rgba(255,215,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_6px_30px_rgba(255,215,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1221]"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          <span className="text-lg">⚡</span>
          <span className="hidden sm:inline">Get Free Audit</span>
          <span className="sm:hidden">Free Audit</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
