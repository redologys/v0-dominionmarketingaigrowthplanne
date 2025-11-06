import type React from "react"
import { Icons } from "./icons"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0B1221] relative overflow-hidden pt-16 pb-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <a href="#" className="inline-flex items-center gap-2.5">
              <Icons.Crown className="h-7 w-7 text-[#FFD700]" />
              <span className="text-white text-xl font-semibold tracking-tight">Dominion Marketing</span>
            </a>
            <p className="text-gray-400 text-base max-w-xs">
              Your partner in measurable growth. We combine technical SEO, conversion-first design, and clear reporting.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-base font-semibold text-white tracking-wider">Navigate</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#work" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Report
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h3 className="text-base font-semibold text-white tracking-wider">Follow Us</h3>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://www.instagram.com/dominion.marketing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-[#FFD700] transition-colors"
              >
                <Icons.Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-500">© {currentYear} Dominion Marketing. All rights reserved.</p>
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
    </footer>
  )
}
