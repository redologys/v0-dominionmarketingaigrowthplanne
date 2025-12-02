import type React from "react"
import { Outfit, Playfair_Display } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
})

export const metadata = {
  title: "Dominion Marketing - AI-Powered Growth Planning",
  description: "Transform your business with data-driven insights and strategic AI-powered growth planning",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-B9DC8KP9T3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B9DC8KP9T3');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
