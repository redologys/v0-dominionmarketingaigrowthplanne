const logos = [
  { name: "Yelp", src: "/logos/1.png" },
  { name: "SEMrush", src: "/logos/2.png" },
  { name: "Notion", src: "/logos/3.png" },
  { name: "Google Ads", src: "/logos/4.png" },
  { name: "Ahrefs", src: "/logos/5.png" },
  { name: "HubSpot", src: "/logos/6.png" },
  { name: "TikTok Ads", src: "/logos/7.png" },
  { name: "Trustpilot", src: "/logos/8.png" },
]

const LogoSet = ({ ariaHidden = false, invisible = false }: { ariaHidden?: boolean; invisible?: boolean }) => (
  <div
    className={`flex flex-shrink-0 animate-ticker gap-12 md:gap-16 items-center pr-12 md:pr-16 ${
      invisible ? "opacity-0 pointer-events-none" : ""
    }`}
    aria-hidden={ariaHidden}
  >
    {logos.map((logo, i) => (
      <img
        key={i}
        src={logo.src || "/placeholder.svg"}
        alt={logo.name}
        className="h-7 md:h-10 w-auto object-contain flex-shrink-0 opacity-80 brightness-0 invert transition-all duration-200 ease-out hover:opacity-100 hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
      />
    ))}
  </div>
)

export const LogoMarquee = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden mask-gradient-clean py-6">
      <div className="flex pause-on-hover">
        <LogoSet />
        <LogoSet ariaHidden />
      </div>
    </div>
  )
}
