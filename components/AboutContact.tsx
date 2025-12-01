"use client"

import type React from "react"
import { useState } from "react"
import { Icons } from "./icons"
import { AnimatedHeadline } from "./AnimatedHeadline"

const highlights = [
  {
    icon: <Icons.Target className="w-5 h-5" />,
    title: "Strategy First",
    description:
      "Every decision starts with your goals — no fluff, just a direct line from marketing to measurable pipeline results.",
  },
  {
    icon: <Icons.TrendingUp className="w-5 h-5" />,
    title: "Data-Driven Growth",
    description: "AI insights + weekly iterations ensure your campaigns adapt faster than your competitors.",
  },
  {
    icon: <Icons.BarChart3 className="w-5 h-5" />,
    title: "Clear Analytics",
    description: "Track what matters with live dashboards and transparent reporting — no more marketing black boxes.",
  },
  {
    icon: <Icons.Handshake className="w-5 h-5" />,
    title: "Dedicated Support",
    description: "A team that thinks like a partner, not a vendor — your wins are our KPIs.",
  },
]

export const AboutContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    goal: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Send lead data to endpoint (replace with your actual endpoint)
      await fetch("https://example.com/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      // Show calendar after successful submission
      setTimeout(() => {
        setShowCalendar(true)
        setIsSubmitting(false)
      }, 400)
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
      // Still show calendar even if endpoint fails (for demo purposes)
      setTimeout(() => {
        setShowCalendar(true)
      }, 400)
    }
  }

  const calUrl = `https://cal.com/dominionmarketing/free-growth-eval?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`

  return (
    <section id="about" className="pt-24 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: About & Highlights */}
          <div>
            <AnimatedHeadline text="Your partner in predictable, measurable growth" />
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              We help ambitious businesses attract more customers and turn their websites into predictable revenue
              engines. Our strategies cut through the noise — built on real data, clear goals, and the kind of
              accountability most agencies only promise.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border border-white/10 p-6 transition-all duration-500 hover:border-[#FFD700]/40 hover:-translate-y-1 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Gradient glow overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Shimmer sweep effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.08) 50%, transparent 60%)",
                      animation: "shimmerSweep 2s ease-in-out infinite",
                    }}
                  />

                  {/* Gold accent border on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: "0 0 30px rgba(255,215,0,0.15), inset 0 0 20px rgba(255,215,0,0.03)",
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 text-[#FFD700] grid place-content-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] group-hover:bg-gradient-to-br group-hover:from-[#FFD700]/30 group-hover:to-[#FFD700]/10"
                        style={{
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        {highlight.icon}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white transition-all duration-300 group-hover:text-[#FFD700]">
                          {highlight.title}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed transition-all duration-300 group-hover:text-gray-300">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="contact"
            className="relative rounded-2xl p-8 md:p-10 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(14,16,19,0.95) 0%, rgba(11,12,16,0.98) 100%)",
              border: "1px solid rgba(255,215,0,0.25)",
              boxShadow: "0 0 50px rgba(255,215,0,0.1), inset 0 1px 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Background gradient accent */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at top right, rgba(255,215,0,0.08) 0%, transparent 50%)",
              }}
            />

            {/* Subtle animated glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-50"
              style={{
                background: "radial-gradient(circle at 30% 20%, rgba(255,215,0,0.05) 0%, transparent 40%)",
                animation: "auraPulse 6s ease-in-out infinite",
              }}
            />

            {!showCalendar ? (
              <div
                className={`relative z-10 transition-opacity duration-400 ${isSubmitting ? "opacity-0" : "opacity-100"}`}
              >
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  Let's grow your business.
                </h3>
                <p className="text-base text-gray-400 mb-8">
                  Tell us your goals and we'll send a custom plan to accelerate your growth.
                </p>

                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full rounded-xl border ${
                        errors.name
                          ? "border-red-500"
                          : focusedField === "name"
                            ? "border-[#FFD700]/60"
                            : "border-white/10"
                      } bg-black/30 px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 caret-[#FFD700]`}
                      style={{
                        boxShadow:
                          focusedField === "name"
                            ? "0 0 20px rgba(255,215,0,0.15), inset 0 1px 2px rgba(0,0,0,0.3)"
                            : "inset 0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    />
                    {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>}
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full rounded-xl border ${
                        errors.email
                          ? "border-red-500"
                          : focusedField === "email"
                            ? "border-[#FFD700]/60"
                            : "border-white/10"
                      } bg-black/30 px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 caret-[#FFD700]`}
                      style={{
                        boxShadow:
                          focusedField === "email"
                            ? "0 0 20px rgba(255,215,0,0.15), inset 0 1px 2px rgba(0,0,0,0.3)"
                            : "inset 0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    />
                    {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>}
                  </div>

                  <input
                    type="text"
                    placeholder="Website URL (optional)"
                    value={formData.website}
                    onFocus={() => setFocusedField("website")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className={`w-full rounded-xl border ${focusedField === "website" ? "border-[#FFD700]/60" : "border-white/10"} bg-black/30 px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 caret-[#FFD700]`}
                    style={{
                      boxShadow:
                        focusedField === "website"
                          ? "0 0 20px rgba(255,215,0,0.15), inset 0 1px 2px rgba(0,0,0,0.3)"
                          : "inset 0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  />

                  <textarea
                    placeholder="What are you trying to achieve?"
                    rows={3}
                    value={formData.goal}
                    onFocus={() => setFocusedField("goal")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className={`w-full rounded-xl border ${focusedField === "goal" ? "border-[#FFD700]/60" : "border-white/10"} bg-black/30 px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none transition-all duration-300 caret-[#FFD700] resize-none`}
                    style={{
                      boxShadow:
                        focusedField === "goal"
                          ? "0 0 20px rgba(255,215,0,0.15), inset 0 1px 2px rgba(0,0,0,0.3)"
                          : "inset 0 1px 2px rgba(0,0,0,0.3)",
                    }}
                  ></textarea>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-gray-900 text-base font-bold px-6 py-4 overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: "0 0 25px rgba(255,215,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 40px rgba(255,215,0,0.6), inset 0 1px 1px rgba(255,255,255,0.3)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 25px rgba(255,215,0,0.4), inset 0 1px 1px rgba(255,255,255,0.3)"
                    }}
                  >
                    {/* Shimmer sweep */}
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                        animation: "shimmerSweep 3s ease-in-out infinite",
                      }}
                    />
                    <Icons.Send className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 relative z-10" />
                    <span className="relative z-10">{isSubmitting ? "Submitting..." : "Design My Growth Path"}</span>
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-2">
                    Or email us directly at{" "}
                    <a
                      href="mailto:dominionmarketing1s@gmail.com"
                      className="text-gray-400 hover:text-[#FFD700] underline underline-offset-2 transition-colors duration-300"
                    >
                      dominionmarketing1s@gmail.com
                    </a>
                  </p>
                </form>
              </div>
            ) : (
              <div className="relative z-10 animate-[fadeIn_0.4s_ease-in-out]">
                <h3 className="text-2xl font-bold tracking-tight text-white mb-4">Schedule Your Free Growth Call</h3>
                <p className="text-base text-gray-400 mb-6">
                  Pick a time that works best for you. We'll discuss your goals and create a custom growth strategy.
                </p>
                <div className="rounded-xl overflow-hidden border border-[#FFD700]/20">
                  <iframe
                    src={calUrl}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    className="bg-white"
                    title="Schedule a call"
                  ></iframe>
                </div>
                <noscript>
                  <p className="mt-4 text-center text-sm text-gray-400">
                    If you can't see the calendar,{" "}
                    <a
                      href="https://cal.com/dominionmarketing/free-growth-eval"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFD700] hover:underline"
                    >
                      click here to book directly
                    </a>
                    .
                  </p>
                </noscript>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
