import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/settings-animations.css"
import { getSession } from "@/lib/auth"
import { getUnreadNotificationsCount } from "@/app/actions/notifications"
import ClientProviders from "@/components/providers/client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Loft Algérie - Gestion des Lofts",
  description: "Application complète de gestion des lofts, propriétaires, transactions et conversations en Algérie",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Loft Algérie",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4F46E5",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession(); // Fetch session in the root layout
  const { count: unreadCount } = session ? await getUnreadNotificationsCount(session.user.id) : { count: null };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Loft Algérie" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <ClientProviders session={session} unreadCount={unreadCount}>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
