"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Icons } from "./icons"

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)

    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0B1221]/80 backdrop-blur border-b border-white/10" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            <a href="#" className="inline-flex items-center gap-2 flex-shrink-0">
              <Icons.Crown className="h-6 w-6 sm:h-7 sm:w-7 text-[#FFD700]" />
              <span className="text-white text-base sm:text-xl font-semibold tracking-tight">Dominion Marketing</span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#services"
                onClick={(e) => handleLinkClick(e, "#services")}
                className="text-base text-gray-300 hover:text-[#FFD700] transition-colors"
              >
                Services
              </a>
              <a
                href="#score"
                onClick={(e) => handleLinkClick(e, "#score")}
                className="text-base text-gray-300 hover:text-[#FFD700] transition-colors"
              >
                Business Score
              </a>
              <a
                href="#work"
                onClick={(e) => handleLinkClick(e, "#work")}
                className="text-base text-gray-300 hover:text-[#FFD700] transition-colors"
              >
                Report
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleLinkClick(e, "#pricing")}
                className="text-base text-gray-300 hover:text-[#FFD700] transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, "#about")}
                className="text-base text-gray-300 hover:text-[#FFD700] transition-colors"
              >
                About
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className="hidden sm:inline-flex items-center justify-center gap-2 text-base font-medium text-gray-200 hover:text-white hover:bg-white/10 ring-1 ring-white/20 rounded-md px-3 py-1.5 transition-colors"
              >
                Contact
              </a>
              <a
                href="#score"
                onClick={(e) => handleLinkClick(e, "#score")}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-[#FFD700] text-gray-900 text-sm sm:text-base font-semibold px-3 sm:px-4 py-2 sm:py-2.5 shadow-[0_0_10px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] hover:bg-amber-300 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-all transform-gpu hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Icons.Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Get a Growth Plan</span>
                <span className="xs:hidden">Get Plan</span>
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-white/10 hover:bg-white/5 text-white transition-colors flex-shrink-0"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Icons.Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0B1221] border-l border-white/10 z-50 md:hidden overflow-y-auto">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-white text-lg font-semibold">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-white/10 hover:bg-white/5 text-white transition-colors"
                  aria-label="Close menu"
                >
                  <Icons.X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col p-4 gap-1">
                <a
                  href="#services"
                  onClick={(e) => handleLinkClick(e, "#services")}
                  className="text-base text-gray-300 hover:text-[#FFD700] hover:bg-white/5 transition-colors px-4 py-3 rounded-md"
                >
                  Services
                </a>
                <a
                  href="#score"
                  onClick={(e) => handleLinkClick(e, "#score")}
                  className="text-base text-gray-300 hover:text-[#FFD700] hover:bg-white/5 transition-colors px-4 py-3 rounded-md"
                >
                  Business Score
                </a>
                <a
                  href="#work"
                  onClick={(e) => handleLinkClick(e, "#work")}
                  className="text-base text-gray-300 hover:text-[#FFD700] hover:bg-white/5 transition-colors px-4 py-3 rounded-md"
                >
                  Report
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => handleLinkClick(e, "#pricing")}
                  className="text-base text-gray-300 hover:text-[#FFD700] hover:bg-white/5 transition-colors px-4 py-3 rounded-md"
                >
                  Pricing
                </a>
                <a
                  href="#about"
                  onClick={(e) => handleLinkClick(e, "#about")}
                  className="text-base text-gray-300 hover:text-[#FFD700] hover:bg-white/5 transition-colors px-4 py-3 rounded-md"
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, "#contact")}
                  className="text-base text-gray-300 hover:text-[#FFD700] hover:bg-white/5 transition-colors px-4 py-3 rounded-md"
                >
                  Contact
                </a>
              </nav>

              {/* CTA Button */}
              <div className="mt-auto p-4 border-t border-white/10">
                <a
                  href="#score"
                  onClick={(e) => handleLinkClick(e, "#score")}
                  className="flex items-center justify-center gap-2 w-full rounded-md bg-[#FFD700] text-gray-900 text-base font-semibold px-4 py-3 shadow-[0_0_10px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] hover:bg-amber-300 transition-all"
                >
                  <Icons.Sparkles className="w-4 h-4" />
                  Get a Growth Plan
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
