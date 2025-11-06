import React from 'react';
import { Icons } from './icons';
import { AnimatedHeadline } from './AnimatedHeadline';

const features = [
  {
    icon: <Icons.Search className="w-6 h-6 text-[#FFD700]" />,
    title: 'Visibility Score',
    description: 'A breakdown of how visible your brand is across Google, Maps, and local search — plus where you can improve.',
  },
  {
    icon: <Icons.BarChart3 className="w-6 h-6 text-[#FFD700]" />,
    title: 'Missed Revenue',
    description: 'We calculate how much traffic and potential customers you’re losing to nearby competitors — and how to win them back.',
  },
  {
    icon: <Icons.Zap className="w-6 h-6 text-[#FFD700]" />,
    title: 'Quick Wins',
    description: 'Instant action steps to fix what’s holding you back and boost your ranking and conversions fast.',
  },
];

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
                <AnimatedHeadline text="What You’ll Get in Your Free Competitor Analysis" />
            </div>
            <p className="mt-3 text-lg text-gray-300">
              See exactly how your business stacks up — and where your competitors are beating you. We’ll show you what’s working, what’s broken, and how to fix it.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#FFD700] hover:-translate-y-1 transition-all duration-300 hover:shadow-[inset_0_2px_4px_#0B122199,0_0_15px_#FFD7004D]">
                <div className="h-10 w-10 grid place-content-center">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
              <a href="#score" className="inline-flex items-center gap-2 rounded-xl bg-[#FFD700] px-8 py-4 text-lg font-medium text-gray-900 shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1425]">
                  Generate My Report
                  <Icons.ArrowRight className="w-5 h-5" />
              </a>
          </div>
        </div>
      </section>
    </>
  );
};
