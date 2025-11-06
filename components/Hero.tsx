import type React from "react"
import { Icons } from "./icons"
import { ParticleBackground } from "./ParticleBackground"
import { LogoMarquee } from "./LogoMarquee"

export const Hero: React.FC = () => {
  return (
    <>
      <style>{`
        .light-sweep {
          position: relative;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: linear-gradient(90deg, #FFD700, #FFFFFF, #FFD700);
          background-size: 200% 100%;
          animation: light-sweep-anim 10s linear infinite;
        }
        @keyframes light-sweep-anim {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
      `}</style>
      {/* Hero Content Section */}
      <section className="relative overflow-hidden pt-28 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px), linear-gradient(to right, rgba(255, 215, 0, 0.05) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255, 215, 0, 0.15) 0%, transparent 70%)" }}
          ></div>
          <ParticleBackground />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="animate-fade-up max-w-5xl mx-auto text-5xl sm:text-6xl md:text-7xl font-bold text-white font-sans tracking-[-0.02em] leading-[1.1]">
            Ready to <span className="font-serif italic light-sweep">dominate</span> your market — not just compete?
          </h1>

          <p
            className="max-w-2xl text-lg sm:text-xl font-normal mt-6 mx-auto font-sans leading-[1.5] text-gray-300 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            We build performance systems that turn your website into a revenue engine. Predictable growth, measurable
            results, and no wasted ad spend.
          </p>

          <div className="mt-8 flex items-center justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="#score"
              className="inline-flex items-center gap-3 rounded-xl bg-[#FFD700] px-8 py-4 text-lg font-semibold text-gray-900 shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1221] group"
            >
              <Icons.Zap className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="transition-colors duration-300 delay-50">Reveal My Growth Potential</span>
            </a>
          </div>
        </div>
      </section>

      {/* Logo Strip Section */}
      <section className="relative pt-12 pb-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <p className="text-[#FFD700] text-sm font-semibold mb-10 tracking-[0.25em] uppercase">
              POWERED BY INDUSTRY-LEADING PLATFORMS
            </p>
            <LogoMarquee />
          </div>
        </div>
      </section>
    </>
  )
}
