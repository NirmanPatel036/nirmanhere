import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const roobert = localFont({
  src: [
    {
      path: '../public/fonts/RoobertTRIAL-Light-BF67243fd502239.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/RoobertTRIAL-Regular-BF67243fd53fdf2.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/RoobertTRIAL-Medium-BF67243fd53e059.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/RoobertTRIAL-SemiBold-BF67243fd54213d.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/RoobertTRIAL-Bold-BF67243fd540abb.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/RoobertTRIAL-Heavy-BF67243fd53e164.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: "--font-roobert",
})

export const metadata: Metadata = {
  
  title: "Nirman Here!",
  description: "AI/ML Developer & Quantum Computing Enthusiast",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roobert.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={roobert.className}>{children}</body>
    </html>
  )
}
