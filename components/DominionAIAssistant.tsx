"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "./icons"

export const DominionAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi there 👋 Need help picking the right plan or learning about our AI tools?",
    },
  ])

  const suggestions = ["View pricing", "See sample report", "Book a free call"]

  const handleSuggestionClick = (suggestion: string) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: suggestion }])

    // Simulate bot response
    setTimeout(() => {
      let response = ""
      if (suggestion === "View pricing") {
        response = "Great! Let me take you to our pricing section where you can see all our plans."
        setTimeout(() => {
          const pricingSection = document.querySelector('[id*="pricing"]')
          if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 500)
      } else if (suggestion === "See sample report") {
        response =
          "I'd love to show you a sample report! You can run a free audit right now to see exactly what you'll get."
        setTimeout(() => {
          const scoreSection = document.getElementById("score")
          if (scoreSection) {
            scoreSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 500)
      } else if (suggestion === "Book a free call") {
        response = "Perfect! I'll redirect you to book a strategy call with our team."
        setTimeout(() => {
          window.open("https://www.instagram.com/dominion.marketing", "_blank")
        }, 500)
      }
      setMessages((prev) => [...prev, { type: "bot", text: response }])
    }, 600)
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
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0E1425] to-[#1a2235] border border-[#FFD700]/40 px-5 py-3 shadow-[0_4px_20px_rgba(255,215,0,0.3)] backdrop-blur-md transition-all hover:scale-105 hover:shadow-[0_6px_30px_rgba(255,215,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
          >
            <div className="relative">
              <Icons.MessageCircle className="w-6 h-6 text-[#FFD700]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0E1425]"></span>
            </div>
            <span className="text-white font-semibold text-sm hidden sm:inline">Dominion AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-96 h-[500px] rounded-2xl bg-[#0E1425]/95 border border-[#FFD700]/40 shadow-[0_8px_40px_rgba(255,215,0,0.3)] backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#FFD700]/20 bg-gradient-to-r from-[#0E1425] to-[#1a2235]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                    <Icons.Bot className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0E1425]"></span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Dominion AI Assistant</h3>
                  <p className="text-gray-400 text-xs">Online now</p>
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
            </div>

            {/* Suggestions */}
            <div className="p-4 border-t border-[#FFD700]/20 bg-[#0E1425]/50">
              <p className="text-gray-400 text-xs mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-[#FFD700]/30 text-[#FFD700] text-xs font-medium hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
