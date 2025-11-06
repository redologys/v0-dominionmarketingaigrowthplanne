import type React from "react"
import { Icons } from "./icons"
import { AnimatedHeadline } from "./AnimatedHeadline"

const services = [
  {
    title: "AI Competitor Analysis",
    description: "Uncover your rivals' strategies, strengths, and weaknesses with deep AI analysis.",
    features: ["Market positioning", "Ad campaign insights"],
  },
  {
    title: "Data-Driven Strategy",
    description: "Craft winning marketing roadmaps based on predictive analytics and consumer behavior.",
    features: ["Audience segmentation", "Growth forecasting"],
  },
  {
    title: "Automated Content Creation",
    description: "Generate high-quality, SEO-optimized content at scale to attract and engage your audience.",
    features: ["Blog posts & articles", "Social media copy"],
  },
  {
    title: "Performance Marketing",
    description: "Optimize your ad spend with AI algorithms that maximize ROI across all channels.",
    features: ["A/B testing automation", "Budget allocation"],
  },
]

export const Services: React.FC = () => {
  return (
    <section id="services" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1221]/50 to-transparent"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <p className="text-sm font-semibold tracking-wider text-[#FFD700] uppercase">Our Capabilities</p>
            <div className="relative">
              <AnimatedHeadline text="Intelligence-driven marketing, end to end" />
              <span className="absolute -bottom-2 left-0 w-1/3 h-0.5 bg-gradient-to-r from-[#FFD700] to-transparent"></span>
            </div>
          </div>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center justify-center gap-2 text-base font-medium text-gray-200 hover:text-white hover:bg-white/10 ring-1 ring-white/20 rounded-lg px-4 py-2.5 transition-colors mt-6 md:mt-0 flex-shrink-0 group"
          >
            <span className="transition-colors duration-300 delay-50">Launch My Strategy</span>
            <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            >
              <h3 className="text-xl font-semibold tracking-tight text-white">{service.title}</h3>
              <p className="mt-2 text-base text-gray-300">{service.description}</p>
              <ul className="mt-4 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300">
                    <Icons.Check className="w-4 h-4 text-[#FFD700]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
