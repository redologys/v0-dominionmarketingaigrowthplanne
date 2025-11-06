"use client"

import type React from "react"
import { useState } from "react"
import { Icons } from "./icons"
import { AnimatedHeadline } from "./AnimatedHeadline"

const plans = [
  {
    tier: "starter",
    planNumber: "01",
    title: "Kickstart Growth",
    tagline: "Launch your business online in days, not weeks.",
    description: "Get found locally and start attracting customers with a professional web presence.",
    setupFee: "$1,200",
    monthlyRetainer: null,
    quarterlyRetainer: null,
    period: "one-time setup",
    features: [
      { text: "Basic Website Design (up to 5 pages)", isAI: false },
      { text: "Social Media Account Creation (Facebook, Instagram, Google)", isAI: false },
      { text: "Local SEO Foundation", isAI: false },
      { text: "Basic Analytics Dashboard", isAI: false },
    ],
    ctaText: "Get Started",
  },
  {
    tier: "growth",
    planNumber: "02",
    title: "Dominate Locally",
    tagline: "Turn local visibility into consistent revenue.",
    description: "Scale your reach with AI-powered marketing that works while you focus on your business.",
    setupFee: "$2,400",
    monthlyRetainer: "$650/mo",
    quarterlyRetainer: "$1,800/quarter",
    quarterlySavings: "$150",
    features: [
      { text: "Advanced Website Design (custom UI + SEO optimization)", isAI: false },
      { text: "Social Media Management & Content Scheduling", isAI: false },
      {
        text: "Exclusive Market Insights Dashboard",
        isAI: true,
        tooltip: "Real-time competitive intelligence and market positioning analysis",
      },
      {
        text: "Performance Copycrafted by AI",
        isAI: true,
        tooltip: "AI-powered ad copy generation optimized for conversions",
      },
      { text: "CRM Integration & Custom Dashboards", isAI: false },
      { text: "Conversion-Focused Strategy Sessions", isAI: false },
    ],
    ctaText: "Start Local Growth Plan",
  },
  {
    tier: "enterprise",
    planNumber: "03",
    title: "Expand Online",
    tagline: "Own your market with enterprise-level strategy.",
    description: "Custom campaigns and dedicated support to dominate your industry online.",
    setupFee: "Custom",
    monthlyRetainer: "Custom retainer",
    quarterlyRetainer: "Custom retainer",
    customNote: "Tailored partnership built around your growth goals.",
    features: [
      { text: "Dedicated Account Manager", isAI: false },
      {
        text: "Private Market Intelligence Suite",
        isAI: true,
        tooltip: "Comprehensive competitor analysis with predictive market insights",
      },
      {
        text: "White-Glove Growth Reporting",
        isAI: true,
        tooltip: "Personalized performance reports with strategic recommendations",
      },
      { text: "Full Multi-Channel Campaigns", isAI: false },
      { text: "Custom API & CRM Integrations", isAI: false },
      { text: "End-to-End Automation Setup", isAI: false },
    ],
    ctaText: "Book Strategy Call",
  },
]

const FeatureItem = ({ feature }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <li className="flex items-start gap-3 relative group pr-8">
      <Icons.Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
      <span
        className={
          feature.isAI
            ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent font-medium italic leading-relaxed"
            : "leading-relaxed text-gray-100"
        }
      >
        {feature.text}
      </span>
      {feature.tooltip && (
        <div
          className="absolute right-0 top-0.5"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Icons.Info className="w-3.5 h-3.5 text-[#FFD700]/60 cursor-help flex-shrink-0 hover:text-[#FFD700] transition-colors" />
          {showTooltip && (
            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-[#0E1425] border border-[#FFD700]/40 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_15px_rgba(255,215,0,0.2)] text-xs text-gray-200 z-[100] animate-fade-in">
              {feature.tooltip}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#FFD700]/40"></div>
            </div>
          )}
        </div>
      )}
    </li>
  )
}

const PlanCard = ({ plan, billingCycle }) => {
  const isFeatured = plan.tier === "growth"
  const isEnterprise = plan.tier === "enterprise"
  const isStarter = plan.tier === "starter"

  const displayRetainer = billingCycle === "monthly" ? plan.monthlyRetainer : plan.quarterlyRetainer

  const ctaBaseClasses =
    "inline-flex items-center justify-center gap-2 w-full rounded-lg text-base font-semibold px-4 py-3 transition-all duration-300 group"
  const featuredButtonClasses =
    "bg-[#FFD700] text-gray-900 shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] hover:bg-amber-300"
  const outlineButtonClasses = "bg-transparent border border-[#FFD700]/50 text-white hover:bg-[#FFD700]/10"

  const content = (
    <>
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-bold text-white">
          {plan.planNumber}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold tracking-tight text-white">{plan.title}</h3>
        {plan.tagline && <p className="mt-2 text-sm text-gray-300 italic">{plan.tagline}</p>}
        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
        <p className="mt-3 text-base text-gray-300 min-h-[3rem]">{plan.description}</p>
      </div>

      <div className="mt-6 mb-8">
        <div className="text-center">
          <span className="text-5xl font-bold tracking-tight text-white">{plan.setupFee}</span>
          <p className="text-sm text-gray-300 mt-2">
            {plan.tier === "starter" ? "one-time setup" : plan.tier === "enterprise" ? "setup fee" : "setup fee"}
          </p>
        </div>

        {plan.monthlyRetainer && (
          <>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="text-center">
              <span className="text-3xl font-bold tracking-tight text-white animate-fade-in">+ {displayRetainer}</span>
              {billingCycle === "quarterly" && plan.quarterlySavings && (
                <div className="mt-2 mb-3 flex justify-center animate-fade-in">
                  <div className="inline-block rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#FFD700] text-xs px-4 py-1.5 font-medium tracking-wide uppercase shadow-[0_2px_10px_rgba(255,215,0,0.3),0_0_20px_rgba(255,215,0,0.15)]">
                    Save {plan.quarterlySavings}
                  </div>
                </div>
              )}
              {plan.tier === "enterprise" && plan.customNote && (
                <p className="text-sm text-gray-300 mt-2 italic">{plan.customNote}</p>
              )}
            </div>
          </>
        )}
      </div>

      <ul className="space-y-4 text-base text-gray-100 mb-8 flex-grow overflow-visible">
        {plan.features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} />
        ))}
      </ul>

      <div className="mt-auto">
        <a href="#contact" className={`${ctaBaseClasses} ${isFeatured ? featuredButtonClasses : outlineButtonClasses}`}>
          {plan.ctaText}
          <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
        <p className="text-xs text-gray-300 text-center mt-2">
          Billed {billingCycle === "monthly" ? "Monthly" : "Quarterly"}
        </p>
      </div>
    </>
  )

  if (isEnterprise) {
    return (
      <div className="p-px rounded-[2rem] bg-gradient-to-b from-[#FFD700]/30 to-white/10 h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:scale-105 overflow-visible">
        <div className="bg-[#0f1422] rounded-[calc(2rem-1px)] h-full p-8 flex flex-col overflow-visible">{content}</div>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-[2rem] p-8 backdrop-blur-lg transition-all duration-300 h-full flex flex-col hover:scale-105 overflow-visible ${isFeatured ? "bg-white/10 border border-[#FFD700]/50" : "bg-white/5 border border-white/20 hover:border-[#FFD700]/30 hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"}`}
    >
      {isFeatured && <div className="absolute inset-0 rounded-[2rem] animate-halo-glow -z-10"></div>}
      {content}
    </div>
  )
}

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly">("monthly")

  return (
    <section id="pricing" className="pt-24 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <AnimatedHeadline text="Plans built for growth" />
          <p className="mt-4 text-lg text-gray-300 leading-relaxed">
            Start with a free score and strategy call. We'll tailor a package to your goals and budget.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 mb-12">
          <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "quarterly" : "monthly")}
            className="relative w-14 h-7 rounded-full bg-white/10 border border-[#FFD700]/30 transition-all duration-300 hover:border-[#FFD700]/50"
            aria-label="Toggle billing cycle"
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-transform duration-300 ${billingCycle === "quarterly" ? "translate-x-7" : ""}`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === "quarterly" ? "text-white" : "text-gray-400"}`}>
            Quarterly
          </span>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8 items-stretch overflow-visible">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`animate-fade-up transition-transform duration-500 overflow-visible relative ${plan.tier === "growth" ? "" : "lg:hover:scale-105"}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {plan.tier === "growth" && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFD84D] to-[#FFA500] shadow-[0_0_12px_rgba(255,200,0,0.4),0_4px_15px_rgba(0,0,0,0.3)] transition-transform duration-250 hover:scale-105">
                    <span className="text-[#111] font-semibold text-[0.85rem] whitespace-nowrap">
                      ⭐ Most Popular — Best for Local Businesses
                    </span>
                  </div>
                </div>
              )}
              <PlanCard plan={plan} billingCycle={billingCycle} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-300">
            Need a custom growth plan? Our team builds strategies tailored to your market.&nbsp;
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 font-semibold text-[#FFD700] transition-all group hover:text-amber-300 hover:[text-shadow:0_0_10px_#FFD700]"
            >
              Contact Our Team
              <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
