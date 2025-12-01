import type React from "react"
import { Icons } from "./icons"
import { AnimatedHeadline } from "./AnimatedHeadline"

const services = [
  {
    title: "Market and Competitor Intelligence",
    subtitle: "Business Insight Analysis",
    description: "Gain clarity on how competitors attract customers and find opportunities to outperform them.",
    features: ["Competitor performance insights", "Search and demand trends", "Growth opportunities ready for capture"],
  },
  {
    title: "Growth Strategy and SEO",
    subtitle: "Strategic Growth Blueprint",
    description:
      "A data driven plan that increases visibility, strengthens your brand, and drives consistent customer flow.",
    features: ["Complete SEO optimization", "Growth across search platforms", "Targeting based on real behavior"],
  },
  {
    title: "Brand and Content Engine",
    subtitle: "Digital Presence and Content Advantage",
    description: "We elevate your online presence with design and content that builds trust and drives action.",
    features: [
      "High performing website or redesign",
      "Optimized content and articles",
      "Review and reputation enhancement",
    ],
  },
  {
    title: "Paid Marketing and Visibility Systems",
    subtitle: "Performance Advertising and Presence Boost",
    description: "Ad campaigns built for measurable results and stronger visibility across every platform.",
    features: [
      "Profile setup and optimization",
      "High converting advertising",
      "Conversion tracking and budget control",
    ],
  },
]

export const Services: React.FC = () => {
  return (
    <section id="services" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1221]/50 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.03)_0%,transparent_70%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14">
          <div>
            <p className="text-sm font-semibold tracking-wider text-[#FFD700] uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
              Our Capabilities
            </p>
            <div className="relative mt-2">
              <AnimatedHeadline text="Intelligence driven marketing built for real-world business growth" />
              <span className="absolute -bottom-3 left-0 w-1/3 h-0.5 bg-gradient-to-r from-[#FFD700] to-transparent"></span>
            </div>
          </div>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center justify-center gap-2 text-base font-medium text-gray-200 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] ring-1 ring-white/20 hover:ring-[#FFD700]/40 rounded-xl px-5 py-3 transition-all duration-500 mt-6 md:mt-0 flex-shrink-0 group relative overflow-hidden hover:shadow-[0_0_25px_rgba(255,215,0,0.15)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative transition-colors duration-300 delay-50">Launch My Strategy</span>
            <Icons.ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[rgba(255,216,91,0.3)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(255,215,0,0.15)] group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD700]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <h3 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-[#FFD700]/90 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm font-medium text-[#FFD700]/80 tracking-wide mb-5">{service.subtitle}</p>

                <p className="text-sm text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <Icons.Check className="w-4 h-4 text-[#FFD85B] drop-shadow-[0_0_4px_rgba(255,216,91,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(255,216,91,0.9)] transition-all duration-300" />
                        <div className="absolute inset-0 bg-[#FFD85B] rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      </div>
                      <span className="group-hover:text-white transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
