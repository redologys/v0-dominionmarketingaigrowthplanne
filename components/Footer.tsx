"use client"

import type React from "react"
import { useState } from "react"
import { Icons } from "./icons"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const [showEmailPopup, setShowEmailPopup] = useState(false)

  return (
    <footer className="bg-gradient-to-b from-[#0B1221] to-[#080C14] relative overflow-hidden pt-20 pb-12 px-6 sm:px-8 lg:px-12">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,215,0,0.03) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <a href="#" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <Icons.Crown className="h-8 w-8 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.7)] transition-all duration-300" />
              </div>
              <span className="text-white text-xl font-semibold tracking-tight group-hover:text-[#FFD700]/90 transition-colors duration-300">
                Dominion Marketing
              </span>
            </a>
            <p className="text-gray-400 text-base max-w-xs leading-relaxed">
              Your partner in measurable growth. We combine technical SEO, conversion-first design, and clear reporting.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Trusted by growing businesses</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-base font-semibold text-white tracking-wider mb-5">Navigate</h3>
            <ul className="space-y-3.5">
              {[
                { href: "#services", label: "Services" },
                { href: "#work", label: "Report" },
                { href: "#pricing", label: "Pricing" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                      <Icons.ArrowRight className="w-4 h-4" />
                    </span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h3 className="text-base font-semibold text-white tracking-wider mb-5">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61584264459550"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="relative p-3 rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-all duration-300 group"
              >
                <Icons.Facebook className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="https://www.instagram.com/dominion.marketing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="relative p-3 rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-all duration-300 group"
              >
                <Icons.Instagram className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <button
                onClick={() => setShowEmailPopup(true)}
                aria-label="Email"
                className="relative p-3 rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-all duration-300 group"
              >
                <Icons.Mail className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© {currentYear} Dominion Marketing. All rights reserved.</p>
            <p className="text-xs text-gray-600">Built for growth. Powered by data.</p>
          </div>
        </div>
      </div>

      {/* Bottom animated line */}
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #FFD700, transparent)",
          animation: "bottom-line-shimmer 8s linear infinite",
        }}
      ></div>

      {showEmailPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowEmailPopup(false)}
        >
          <div
            className="relative bg-gradient-to-br from-[#0F1629] to-[#0B1221] border border-white/10 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowEmailPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <Icons.X className="w-5 h-5" />
            </button>

            {/* Email icon */}
            <div className="flex justify-center mb-6">
              <div className="relative p-4 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/30">
                <Icons.Mail className="w-8 h-8 text-[#FFD700]" />
                <div className="absolute inset-0 rounded-full animate-ping bg-[#FFD700]/10"></div>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-white text-center mb-2">Get in Touch</h3>
            <p className="text-gray-400 text-center mb-6">
              Send us an email and we'll get back to you within 24 hours.
            </p>

            {/* Email display */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-[#FFD700] text-center font-medium select-all">dominionmarketing1s@gmail.com</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText("dominionmarketing1s@gmail.com")
                  setShowEmailPopup(false)
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
              >
                Copy Email
              </button>
              <a
                href="mailto:dominionmarketing1s@gmail.com"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold text-center hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300"
              >
                Open Mail App
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
