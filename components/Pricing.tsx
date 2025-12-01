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
    setupFee: "$700",
    monthlyRetainer: "$250/mo",
    quarterlyRetainer: "$700/quarter",
    quarterlySavings: "$50",
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
    setupFee: "$1,500",
    monthlyRetainer: "$500/mo",
    quarterlyRetainer: "$1,400/quarter",
    quarterlySavings: "$100",
    features: [
      { text: "Advanced Website Design (custom UI + SEO optimization)", isAI: false },
      { text: "Social Media Management & Content Scheduling", isAI: false },
      { text: "CRM Integration & Custom Dashboards", isAI: false },
      { text: "Conversion-Focused Strategy Sessions", isAI: false },
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
      { text: "Full Multi-Channel Campaigns", isAI: false },
      { text: "Custom API & CRM Integrations", isAI: false },
      { text: "End-to-End Automation Setup", isAI: false },
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
    ],
    ctaText: "Book Strategy Call",
  },
]

const FeatureItem = ({ feature }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <li className="flex items-start gap-3 relative group/feature pr-8">
      <div className="relative">
        <Icons.Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover/feature:text-emerald-300 group-hover/feature:drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
      </div>
      <span
        className={
          feature.isAI
            ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent font-medium italic leading-relaxed transition-all duration-300 group-hover/feature:from-[#FFE44D] group-hover/feature:to-[#FFB84D]"
            : "leading-relaxed text-gray-300 transition-colors duration-300 group-hover/feature:text-white"
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
    "inline-flex items-center justify-center gap-2 w-full rounded-xl text-base font-semibold px-5 py-3.5 transition-all duration-400 group/btn relative overflow-hidden"
  const featuredButtonClasses =
    "bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-gray-900 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] hover:from-[#FFE44D] hover:to-[#FFD700] active:scale-[0.98]"
  const outlineButtonClasses =
    "bg-transparent border border-[#FFD700]/40 text-white hover:bg-[#FFD700]/10 hover:border-[#FFD700]/70 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] active:scale-[0.98]"

  const content = (
    <>
      <div className="flex justify-between items-start">
        <div className="w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 text-lg font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 group-hover:border-[#FFD700]/40 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]">
          {plan.planNumber}
        </div>
      </div>

      <div className="mt-7">
        <h3 className="text-2xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[#FFD700]">
          {plan.title}
        </h3>
        {plan.tagline && (
          <p className="mt-2.5 text-sm text-gray-400 italic transition-colors duration-300 group-hover:text-gray-300">
            {plan.tagline}
          </p>
        )}
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent transition-all duration-500 group-hover:via-[#FFD700]/50"></div>
        <p className="mt-4 text-base text-gray-400 min-h-[3rem] leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
          {plan.description}
        </p>
      </div>

      <div className="mt-8 mb-8">
        <div className="text-center">
          <span className="text-5xl font-bold tracking-tight text-white transition-all duration-300 group-hover:text-[#FFD700] group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            {plan.setupFee}
          </span>
          <p className="text-sm text-gray-400 mt-2 font-medium uppercase tracking-wider">
            {plan.tier === "starter" ? "one-time setup" : plan.tier === "enterprise" ? "setup fee" : "setup fee"}
          </p>
        </div>

        {plan.monthlyRetainer && (
          <>
            <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
            <div className="text-center">
              <span className="text-3xl font-bold tracking-tight text-white animate-fade-in">+ {displayRetainer}</span>
              {billingCycle === "quarterly" && plan.quarterlySavings && (
                <div className="mt-3 mb-3 flex justify-center animate-fade-in">
                  <div className="inline-block rounded-full bg-gradient-to-r from-[#FFD700]/15 to-[#FFA500]/15 border border-[#FFD700]/50 text-[#FFD700] text-xs px-5 py-2 font-semibold tracking-wide uppercase shadow-[0_2px_15px_rgba(255,215,0,0.25),0_0_25px_rgba(255,215,0,0.1)]">
                    Save {plan.quarterlySavings}
                  </div>
                </div>
              )}
              {plan.tier === "enterprise" && plan.customNote && (
                <p className="text-sm text-gray-400 mt-2 italic">{plan.customNote}</p>
              )}
            </div>
          </>
        )}
      </div>

      <ul className="space-y-4 text-base text-gray-100 mb-10 flex-grow overflow-visible">
        {plan.features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} />
        ))}
      </ul>

      <div className="mt-auto">
        <a href="#contact" className={`${ctaBaseClasses} ${isFeatured ? featuredButtonClasses : outlineButtonClasses}`}>
          <span className="relative z-10">{plan.ctaText}</span>
          <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5 relative z-10" />
          <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
        </a>
        <p className="text-xs text-gray-500 text-center mt-3 font-medium">
          Billed {billingCycle === "monthly" ? "Monthly" : "Quarterly"}
        </p>
      </div>
    </>
  )

  if (isEnterprise) {
    return (
      <div className="group p-[1px] rounded-[2rem] bg-gradient-to-b from-[#FFD700]/40 via-[#FFD700]/20 to-white/10 h-full transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,215,0,0.25),0_20px_60px_rgba(0,0,0,0.4)] hover:from-[#FFD700]/60 hover:via-[#FFD700]/30 overflow-visible">
        <div className="bg-gradient-to-b from-[#0f1422] to-[#0a0e18] rounded-[calc(2rem-1px)] h-full p-8 flex flex-col overflow-visible">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative rounded-[2rem] p-8 backdrop-blur-xl transition-all duration-500 h-full flex flex-col overflow-visible
        ${
          isFeatured
            ? "bg-gradient-to-b from-white/[0.12] to-white/[0.04] border border-[#FFD700]/50 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
            : "bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 hover:border-[#FFD700]/40 hover:shadow-[0_0_35px_rgba(255,215,0,0.12),0_20px_50px_rgba(0,0,0,0.3)]"
        }
        hover:bg-gradient-to-b hover:from-white/[0.14] hover:to-white/[0.06]
      `}
    >
      {isFeatured && (
        <div className="absolute inset-0 rounded-[2rem] animate-halo-glow -z-10 pointer-events-none"></div>
      )}
      <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#FFD700]/5 via-transparent to-transparent pointer-events-none"></div>
      {content}
    </div>
  )
}

export const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly">("monthly")

  return (
    <section id="pricing" className="pt-24 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <AnimatedHeadline text="Plans built for growth" />
          <p className="mt-5 text-lg text-gray-400 leading-relaxed">
            Start with a free score and strategy call. We'll tailor a package to your goals and budget.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8 mb-14">
          <span
            className={`text-sm font-medium transition-all duration-300 ${billingCycle === "monthly" ? "text-white" : "text-gray-500"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "quarterly" : "monthly")}
            className="relative w-16 h-8 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-[#FFD700]/30 transition-all duration-300 hover:border-[#FFD700]/60 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
            aria-label="Toggle billing cycle"
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC000] shadow-[0_0_12px_rgba(255,215,0,0.6)] transition-all duration-400 ease-out ${billingCycle === "quarterly" ? "translate-x-8" : ""}`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-all duration-300 ${billingCycle === "quarterly" ? "text-white" : "text-gray-500"}`}
          >
            Quarterly
          </span>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-8 items-stretch overflow-visible">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`animate-fade-up transition-all duration-500 overflow-visible relative
                ${
                  plan.tier === "growth"
                    ? "lg:scale-[1.02] lg:hover:scale-[1.05]"
                    : "lg:hover:scale-[1.03] lg:hover:-translate-y-2"
                }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {plan.tier === "growth" && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFA500] shadow-[0_0_20px_rgba(255,200,0,0.5),0_6px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,200,0,0.7)] animate-badge-slide-in">
                    <span className="text-[#111] font-bold text-sm whitespace-nowrap tracking-wide">
                      Most Popular — Best for Local Businesses
                    </span>
                  </div>
                </div>
              )}
              <PlanCard plan={plan} billingCycle={billingCycle} />
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-lg text-gray-400">
            Need a custom growth plan? Our team builds strategies tailored to your market.&nbsp;
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-semibold text-[#FFD700] transition-all duration-300 group hover:text-[#FFE44D] hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
            >
              Contact Our Team
              <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
