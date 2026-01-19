import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meal Planner Agent',
  description: 'AI-powered meal planning with Claude',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
