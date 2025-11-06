import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { BusinessScore } from "./components/BusinessScore"
import { Services } from "./components/Services"
import { Work } from "./components/Work"
import { Pricing } from "./components/Pricing"
import { AboutContact } from "./components/AboutContact"
import { Footer } from "./components/Footer"
import { Section } from "./components/Section"
import { AnimatedDivider } from "./components/AnimatedDivider"
import { ExitIntentPopup } from "./components/ExitIntentPopup"
import { DominionAIAssistant } from "./components/DominionAIAssistant"

function App() {
  return (
    <div className="bg-[#0B1221] text-gray-200 font-['Outfit']">
      <Header />
      <main>
        <Hero />
        <AnimatedDivider />
        <Section>
          <Services />
        </Section>
        <AnimatedDivider />
        <Section>
          <BusinessScore />
        </Section>
        <AnimatedDivider />
        <Section>
          <Work />
        </Section>
        <AnimatedDivider />
        <Section>
          <Pricing />
        </Section>
        <AnimatedDivider />
        <Section>
          <AboutContact />
        </Section>
      </main>
      <AnimatedDivider />
      <Footer />
      <ExitIntentPopup />
      <DominionAIAssistant />
    </div>
  )
}

export default App
