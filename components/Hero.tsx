import type React from "react"
import { Icons } from "./icons"
import { ParticleBackground } from "./ParticleBackground"
import { LogoMarquee } from "./LogoMarquee"

export const Hero: React.FC = () => {
  return (
    <>
      <style>{`
        .dynamic-word {
          background: linear-gradient(90deg, #FFD95A, #FFEAA7, #FFD95A);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation:
            shimmer 8s linear infinite,
            goldGlow 5s ease-in-out infinite;
          text-shadow: 0 0 10px rgba(255, 217, 90, 0.35);
        }

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes goldGlow {
          0%, 100% {
            text-shadow: 0 0 8px rgba(255, 217, 90, 0.3),
                         0 0 20px rgba(255, 217, 90, 0.15);
          }
          50% {
            text-shadow: 0 0 25px rgba(255, 217, 90, 0.8),
                         0 0 40px rgba(255, 217, 90, 0.4);
          }
        }

        /* Added premium CTA button animations: breathing glow and shimmer sweep */
        .cta-btn {
          position: relative;
          background: linear-gradient(90deg, #FFD95A, #FFEAA7);
          color: #0D0F13;
          font-weight: 600;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(255, 217, 90, 0.4);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          animation: buttonGlow 5s ease-in-out infinite;
        }

        /* Shimmer sweep effect */
        .cta-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,215,90,0.25), transparent);
          transform: translateX(-100%);
          animation: shimmerSweep 4.5s linear infinite;
        }

        @keyframes shimmerSweep {
          100% { transform: translateX(100%); }
        }

        /* Breathing gold aura */
        @keyframes buttonGlow {
          0%, 100% {
            box-shadow: 0 0 18px rgba(255, 217, 90, 0.3),
                        0 0 35px rgba(255, 217, 90, 0.1);
          }
          50% {
            box-shadow: 0 0 35px rgba(255, 217, 90, 0.7),
                        0 0 65px rgba(255, 217, 90, 0.3);
          }
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(255, 217, 90, 0.7),
                      0 0 80px rgba(255, 217, 90, 0.3);
        }

        .cta-btn .icon {
          transition: transform 0.3s ease;
        }

        .cta-btn:hover .icon {
          transform: scale(1.1);
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
            Ready to <span className="font-serif italic dynamic-word">dominate</span> your market — not just compete?
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
              className="cta-btn inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1221]"
            >
              <Icons.Zap className="icon h-5 w-5" />
              <span>Reveal My Growth Potential</span>
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
