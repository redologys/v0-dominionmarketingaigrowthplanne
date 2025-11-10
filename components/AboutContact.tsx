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
                  className="group relative rounded-xl border border-white/10 p-6 bg-gradient-to-br from-white/5 to-white/[0.02] transition-all duration-500 hover:border-[#FFD700]/30 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#FFD700]/10 text-[#FFD700] grid place-content-center transition-all duration-500 group-hover:bg-[#FFD700]/20 group-hover:-translate-y-1 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                        {highlight.icon}
                      </div>
                      <div className="relative">
                        <div className="text-base font-semibold text-white transition-all duration-300 group-hover:text-[#FFEAA7]">
                          {highlight.title}
                        </div>
                        <div className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FFD700] to-[#FFEAA7] transition-all duration-500 group-hover:w-full" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed transition-all duration-300 group-hover:text-gray-300 group-hover:brightness-110">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form or Calendar */}
          <div
            id="contact"
            className="bg-white/5 border border-[#FFD700]/20 rounded-2xl p-6 md:p-8 shadow-[inset_0_2px_4px_#0B122199,0_0_40px_rgba(255,215,0,0.1)] backdrop-blur-lg"
          >
            {!showCalendar ? (
              <div className={`transition-opacity duration-400 ${isSubmitting ? "opacity-0" : "opacity-100"}`}>
                <h3 className="text-3xl font-semibold tracking-tight text-white">Let's grow your business.</h3>
                <p className="mt-2 text-base text-gray-300">
                  Tell us your goals and we'll send a custom plan to accelerate your growth.
                </p>
                <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full rounded-md border ${
                        errors.name ? "border-red-500" : "border-white/10"
                      } bg-black/20 px-3.5 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition caret-[#FFD700]`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full rounded-md border ${
                        errors.email ? "border-red-500" : "border-white/10"
                      } bg-black/20 px-3.5 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition caret-[#FFD700]`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>
                  <input
                    type="text"
                    placeholder="Website URL (optional)"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-black/20 px-3.5 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition caret-[#FFD700]"
                  />
                  <textarea
                    placeholder="What are you trying to achieve?"
                    rows={3}
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-black/20 px-3.5 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition caret-[#FFD700]"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFD700] text-gray-900 text-base font-semibold px-4 py-3 hover:bg-amber-300 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-all transform-gpu hover:-translate-y-0.5 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Icons.Send className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="transition-colors duration-300 delay-50">
                      {isSubmitting ? "Submitting..." : "Design My Growth Path"}
                    </span>
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Or email us directly at{" "}
                    <a
                      href="mailto:dominionmarketing1s@gmail.com"
                      className="text-gray-400 hover:text-[#FFD700] underline underline-offset-2"
                    >
                      dominionmarketing1s@gmail.com
                    </a>
                  </p>
                </form>
              </div>
            ) : (
              <div className="animate-[fadeIn_0.4s_ease-in-out]">
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-4">
                  Schedule Your Free Growth Call
                </h3>
                <p className="text-base text-gray-300 mb-6">
                  Pick a time that works best for you. We'll discuss your goals and create a custom growth strategy.
                </p>
                <div className="rounded-lg overflow-hidden border border-[#FFD700]/20">
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
