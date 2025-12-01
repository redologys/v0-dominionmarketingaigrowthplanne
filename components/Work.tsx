import type React from "react"
import { Icons } from "./icons"
import { AnimatedHeadline } from "./AnimatedHeadline"

const features = [
  {
    icon: <Icons.Search className="w-8 h-8 text-[#FFD700] icon-search" />,
    title: "Visibility Score",
    description:
      "See how visible your brand is across search results, maps, and other platforms. Instantly spot areas where you can increase exposure.",
  },
  {
    icon: <Icons.BarChart3 className="w-8 h-8 text-[#FFD700] icon-bar" />,
    title: "Missed Revenue",
    description:
      "Find out how much traffic and customers you're losing to competitors and what you need to do to win them back.",
  },
  {
    icon: <Icons.Zap className="w-8 h-8 text-[#FFD700] icon-flash" />,
    title: "Quick Wins",
    description:
      "Get fast, actionable steps to improve your visibility, boost your ranking, and turn more visitors into customers.",
  },
]

export const Work: React.FC = () => {
  return (
    <>
      <section id="work">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1.5 text-sm font-semibold text-[#FFD700]">
              <Icons.Sparkles className="w-3.5 h-3.5" />
              Free Competitor Report
            </div>
            <div className="mt-4">
              <AnimatedHeadline text="What You Get in Your Free Competitor Analysis" />
            </div>
            <p className="mt-3 text-lg text-gray-300">
              See exactly where you stand and what your competitors are doing better. We pinpoint what's working, what's
              broken, and how to beat them.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-8 rounded-xl border border-white/10 hover:border-[#FFD85B]/25 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,216,91,0.15)]"
              >
                <div
                  className="h-12 w-12 grid place-content-center transition-transform duration-300 group-hover:scale-105"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))" }}
                >
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#score"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFD700] px-8 py-4 text-lg font-medium text-gray-900 shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1425] group"
            >
              <span className="transition-colors duration-300 delay-50">See Competitor Insights</span>
              <Icons.ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
