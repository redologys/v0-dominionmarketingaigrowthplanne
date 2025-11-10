"use client"

import type React from "react"
import { useState } from "react"
import { Icons } from "./icons"
import { AnimatedHeadline } from "./AnimatedHeadline"

const highlights = [
  {
    icon: <Icons.Target className="w-4.5 h-4.5" />,
    title: "Strategy First",
    description: "No fluff—everything ties back to pipeline.",
  },
  {
    icon: <Icons.TrendingUp className="w-4.5 h-4.5" />,
    title: "Data-Driven Growth",
    description: "Weekly iterations and clear milestones.",
  },
  {
    icon: <Icons.BarChart3 className="w-4.5 h-4.5" />,
    title: "Clear Analytics",
    description: "Transparent reporting on what moves the needle.",
  },
  {
    icon: <Icons.Handshake className="w-4.5 h-4.5" />,
    title: "Dedicated Support",
    description: "Your goals are our goals. We're in this together.",
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

  const calUrl = `https://cal.com/red-2pcxh4/free-growth-call?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`

  return (
    <section id="about" className="pt-24 pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: About & Highlights */}
          <div>
            <AnimatedHeadline text="Your partner in measurable growth" />
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              Partner with purpose—scale your impact through data-driven growth. We combine technical SEO,
              conversion-first design, and clear reporting so you know exactly what's working.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 p-5 bg-white/5 transition-all duration-300 hover:shadow-[inset_0_1px_2px_rgba(11,18,33,0.9),0_0_15px_rgba(255,215,0,0.3)] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-[#FFD700]/10 text-[#FFD700] grid place-content-center">
                      {highlight.icon}
                    </div>
                    <div className="text-base font-semibold text-white">{highlight.title}</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{highlight.description}</p>
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
                      href="https://cal.com/red-2pcxh4/free-growth-call"
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
