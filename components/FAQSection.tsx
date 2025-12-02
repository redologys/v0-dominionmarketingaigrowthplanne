"use client"

import type React from "react"

import { useState } from "react"
import { Icons } from "./icons"

const faqItems = [
  {
    question: "What is brand identity and design?",
    answer:
      "Brand identity is the visual and verbal expression of your business values, personality, and promise to customers. It includes your logo, color scheme, typography, tone of voice, and messaging that together create a cohesive experience that distinguishes you from competitors.",
  },
  {
    question: "What is brand identity vs brand image?",
    answer:
      "Brand identity is what you intentionally create and communicate about your business. Brand image is how customers actually perceive your brand based on their experiences and interactions. Strong brand identity management helps shape positive brand image.",
  },
  {
    question: "How do I build a strong online presence?",
    answer:
      "Build a strong online presence by creating quality content, optimizing your website for search, maintaining active social media profiles, getting listed on local directories, encouraging customer reviews, and ensuring consistent branding across all platforms.",
  },
  {
    question: "How do I check my online presence?",
    answer:
      "You can check your online presence by searching your business name online, reviewing your social media profiles, checking local directory listings like Google Business Profile and Yelp, monitoring customer reviews, and using tools like our Free Competitor Analysis to see how you rank.",
  },
  {
    question: "What makes a strong brand identity?",
    answer:
      "A strong brand identity is consistent, memorable, authentic, and resonates with your target audience. It clearly communicates your unique value, maintains visual and verbal consistency, and builds emotional connections with customers over time.",
  },
  {
    question: "What are the key elements of a brand identity?",
    answer:
      "Key elements include your logo, color palette, typography, imagery style, brand voice and tone, tagline, values statement, and brand guidelines. These elements work together to create a unified experience across all customer touchpoints.",
  },
  {
    question: "How do I create a strong brand identity?",
    answer:
      "Define your brand values, understand your target audience, research your competitors, develop a unique value proposition, create visual guidelines, establish your brand voice, and ensure consistency across all marketing materials and platforms.",
  },
  {
    question: "What is online presence management?",
    answer:
      "Online presence management involves monitoring and optimizing your business across all digital channels including your website, social media, review sites, and search results to maintain a consistent, positive image and improve visibility.",
  },
  {
    question: "How do I build visibility for my business online?",
    answer:
      "Build visibility through SEO optimization, quality content creation, active social media engagement, local directory optimization, paid advertising, customer reviews and testimonials, and partnerships with complementary businesses.",
  },
]

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1221]/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.02)_0%,transparent_70%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-wider text-[#FFD700] uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
            Brand Identity and Online Presence
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white leading-tight">Questions Answered</h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about building a powerful brand identity and establishing your online presence
            for sustainable growth.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10 hover:border-[rgba(255,216,91,0.3)] transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1221]"
              >
                <span className="text-lg font-semibold text-white text-left hover:text-[#FFD700] transition-colors duration-300">
                  {item.question}
                </span>
                <div className="flex-shrink-0 ml-4">
                  <Icons.ArrowRight
                    className={`w-5 h-5 text-[#FFD700] transition-transform duration-300 ${
                      openIndex === index ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 border-t border-white/10">
                  <p className="text-base text-gray-300 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
