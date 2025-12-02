"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "./icons"

export const DominionAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showSmartSuggestion, setShowSmartSuggestion] = useState(false)
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hey there! I'm Dominion AI — your growth assistant. Want help choosing a plan, seeing your competitor score, or booking a quick strategy call?",
    },
  ])

  const suggestions = [
    { icon: "chart", text: "View Pricing" },
    { icon: "report", text: "See a Sample Report" },
    { icon: "chat", text: "Talk to a Real Expert" },
    { icon: "bolt", text: "Get a Free Audit" },
  ]

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "chart":
        return <Icons.TrendingUp className="w-4 h-4 text-[#FFD700]" />
      case "report":
        return <Icons.BarChart className="w-4 h-4 text-[#FFD700]" />
      case "chat":
        return <Icons.MessageCircle className="w-4 h-4 text-[#FFD700]" />
      case "bolt":
        return <Icons.Zap className="w-4 h-4 text-[#FFD700]" />
      default:
        return null
    }
  }

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 20000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, messages])

  useEffect(() => {
    if (isOpen && messages.length === 1) {
      const timer = setTimeout(() => {
        setShowSmartSuggestion(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [suggestions.length])

  const handleSuggestionClick = (suggestionText: string) => {
    setMessages((prev) => [...prev, { type: "user", text: suggestionText }])
    setShowSmartSuggestion(false)

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      let response = ""
      if (suggestionText === "View Pricing") {
        response = "Great! Let me take you to our pricing section where you can see all our plans."
        setTimeout(() => {
          const pricingSection = document.querySelector('[id*="pricing"]')
          if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 500)
      } else if (suggestionText === "See a Sample Report") {
        response =
          "I'd love to show you a sample report! You can run a free audit right now to see exactly what you'll get."
        setTimeout(() => {
          const scoreSection = document.getElementById("score")
          if (scoreSection) {
            scoreSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 500)
      } else if (suggestionText === "Talk to a Real Expert" || suggestionText === "Get a Free Audit") {
        response = "Perfect! I'll redirect you to book a strategy call with our team."
        setTimeout(() => {
          window.open("https://cal.com/dominionmarketing/free-growth-eval", "_blank")
        }, 500)
      }
      setMessages((prev) => [...prev, { type: "bot", text: response }])
    }, 1200)
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{
                boxShadow: ["0 0 0 0 rgba(255, 215, 0, 0.4)", "0 0 0 12px rgba(255, 215, 0, 0)"],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 rounded-full"
            />
            <div className="relative flex items-center gap-3 rounded-full bg-gradient-to-br from-[#0E1425] via-[#151d30] to-[#0E1425] border border-[#FFD700]/50 px-5 py-3.5 shadow-[0_4px_30px_rgba(255,215,0,0.25)] backdrop-blur-xl overflow-hidden">
              {/* Shimmer sweep */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              {/* Inner glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700]/30 to-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/30">
                    <Icons.MessageCircle className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0E1425] shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  />
                </div>
                <span className="text-white font-semibold text-sm hidden sm:inline tracking-wide">Dominion AI</span>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[580px] rounded-3xl bg-gradient-to-b from-[#0E1425]/98 to-[#0a0f1a]/98 border border-[#FFD700]/30 shadow-[0_8px_60px_rgba(255,215,0,0.2),0_0_0_1px_rgba(255,215,0,0.1)_inset] backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Top gradient accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

            {/* Corner glow accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#FFD700]/3 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-between p-5 border-b border-[#FFD700]/15 bg-gradient-to-r from-[#0E1425]/80 to-[#151d30]/80">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* Pulsing glow ring */}
                  <motion.div
                    animate={{
                      boxShadow: ["0 0 0 0 rgba(255, 215, 0, 0.3)", "0 0 0 10px rgba(255, 215, 0, 0)"],
                    }}
                    transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute inset-0 rounded-full"
                  />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700]/25 to-[#FFD700]/5 flex items-center justify-center border border-[#FFD700]/40 shadow-[0_0_20px_rgba(255,215,0,0.15)_inset]">
                    <Icons.Bot className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0E1425] shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base tracking-wide">Dominion AI</h3>
                  <p className="text-emerald-400 text-xs flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online now
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all duration-300"
                aria-label="Close chat"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-[#FFD700]/20 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-[#FFD700] to-[#f0c000] text-gray-900 shadow-[0_4px_15px_rgba(255,215,0,0.25)]"
                        : "bg-gradient-to-br from-white/10 to-white/5 text-gray-200 border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-br from-white/10 to-white/5 text-gray-200 border border-white/10 rounded-2xl px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Typing</span>
                      <div className="flex gap-1">
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                          className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
                          className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                          className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {showSmartSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="relative bg-gradient-to-br from-[#FFD700]/15 to-[#FFD700]/5 border border-[#FFD700]/40 rounded-2xl p-4 overflow-hidden"
                  >
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/5 to-transparent pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                          <Icons.Zap className="w-3 h-3 text-[#FFD700]" />
                        </div>
                        <p className="text-xs text-[#FFD700] font-semibold tracking-wide">Smart Suggestion</p>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Businesses like yours boosted leads by 42% with our Local Growth Plan — want to see how?
                      </p>
                      <button
                        onClick={() => handleSuggestionClick("View Pricing")}
                        className="mt-3 text-sm text-[#FFD700] font-medium hover:underline flex items-center gap-1 group"
                      >
                        Show me
                        <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative p-5 border-t border-[#FFD700]/15 bg-gradient-to-t from-[#0a0f1a]/80 to-transparent">
              <p className="text-gray-500 text-xs mb-3 font-medium tracking-wide uppercase">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2.5">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="relative px-3 py-3 rounded-xl bg-gradient-to-br from-white/8 to-white/3 border border-[#FFD700]/20 text-white text-xs font-medium overflow-hidden group transition-all duration-300 hover:border-[#FFD700]/50 hover:shadow-[0_4px_20px_rgba(255,215,0,0.15)]"
                  >
                    {/* Hover glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/20 group-hover:border-[#FFD700]/40 transition-all duration-300">
                        {getIcon(suggestion.icon)}
                      </div>
                      <span className="text-left">{suggestion.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
