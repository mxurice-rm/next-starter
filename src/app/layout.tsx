import type { Metadata } from 'next'
import './globals.css'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Starter',
  description: 'Next.js starter for fast, modern web apps.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.className} antialiased`}>{children}</body>
    </html>
  )
}
