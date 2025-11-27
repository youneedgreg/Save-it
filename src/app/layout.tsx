import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/contexts/currency-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Geist, Geist_Mono } from "next/font/google"
import { Suspense } from "react"
import { cookies } from "next/headers"
import type { Currency } from "@/lib/types"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Saveit",
  description: "Earn your financial intelligence",
  icons: {
    icon: [
      { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", url: "/android-chrome-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", url: "/android-chrome-512x512.png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const currency = (cookieStore.get('money-mastery-currency')?.value as Currency) || "KES"

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CurrencyProvider initialCurrency={currency}>
              <Suspense fallback={null}>
                <Navigation />
                {children}
              </Suspense>
              <Toaster />
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
