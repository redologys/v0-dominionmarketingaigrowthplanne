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
      text: "👋 Hey there! I'm Dominion AI — your growth assistant. Want help choosing a plan, seeing your competitor score, or booking a quick strategy call?",
    },
  ])

  const suggestions = [
    { icon: "📈", text: "View Pricing" },
    { icon: "📊", text: "See a Sample Report" },
    { icon: "💬", text: "Talk to a Real Expert" },
    { icon: "⚡", text: "Get a Free Audit" },
  ]

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
    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: suggestionText }])
    setShowSmartSuggestion(false)

    setIsTyping(true)

    // Simulate bot response
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
      {/* Chat Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0E1425] to-[#1a2235] border border-[#FFD700]/40 px-5 py-3 shadow-[0_4px_20px_rgba(255,215,0,0.3)] backdrop-blur-md transition-all hover:shadow-[0_6px_30px_rgba(255,215,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
          >
            <div className="relative">
              <Icons.MessageCircle className="w-6 h-6 text-[#FFD700]" />
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0E1425]"
              ></motion.span>
            </div>
            <span className="text-white font-semibold text-sm hidden sm:inline">Dominion AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-96 h-[550px] rounded-2xl bg-[#0E1425]/95 border border-[#FFD700]/40 shadow-[0_8px_40px_rgba(255,215,0,0.3)] backdrop-blur-xl flex flex-col overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-[#0E1425] via-[#FFD700] to-[#0E1425]"></div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#FFD700]/20 bg-gradient-to-r from-[#0E1425] to-[#1a2235]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    animate={{ boxShadow: ["0 0 0 0 rgba(255, 215, 0, 0.4)", "0 0 0 8px rgba(255, 215, 0, 0)"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center"
                  >
                    <Icons.Bot className="w-6 h-6 text-[#FFD700]" />
                  </motion.div>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0E1425]"
                  ></motion.span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Dominion AI Assistant</h3>
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Online now
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-[#FFD700] transition"
                aria-label="Close chat"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      message.type === "user"
                        ? "bg-[#FFD700] text-gray-900"
                        : "bg-white/10 text-gray-200 border border-white/10"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 text-gray-200 border border-white/10 rounded-2xl px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Dominion AI Assistant is typing</span>
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                        className="w-1 h-1 bg-[#FFD700] rounded-full"
                      ></motion.span>
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                        className="w-1 h-1 bg-[#FFD700] rounded-full"
                      ></motion.span>
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                        className="w-1 h-1 bg-[#FFD700] rounded-full"
                      ></motion.span>
                    </div>
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {showSmartSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 border border-[#FFD700]/30 rounded-xl p-3"
                  >
                    <p className="text-xs text-[#FFD700] font-semibold mb-1">💡 Smart Suggestion</p>
                    <p className="text-xs text-gray-300">
                      Businesses like yours boosted leads by 42% with our Local Growth Plan — want to see how?
                    </p>
                    <button
                      onClick={() => handleSuggestionClick("View Pricing")}
                      className="mt-2 text-xs text-[#FFD700] hover:underline"
                    >
                      Show me →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-[#FFD700]/20 bg-[#0E1425]/50">
              <p className="text-gray-400 text-xs mb-3">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="px-3 py-2.5 rounded-xl bg-white/5 border border-[#FFD700]/30 text-white text-xs font-medium hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition flex items-center gap-2"
                  >
                    <span>{suggestion.icon}</span>
                    <span>{suggestion.text}</span>
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
