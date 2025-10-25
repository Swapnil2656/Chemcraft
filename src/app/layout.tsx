import '@/styles/globals.css'
import '@/styles/browser-fixes.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/ThemeProvider'
import ChemicalBackground from '@/components/ChemicalBackground'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChemCraft - Interactive Chemistry Learning',
  description: 'Explore the periodic table, mix elements, and test your chemistry knowledge with ChemCraft',
  keywords: ['chemistry', 'periodic table', 'elements', 'education', 'learning'],
  authors: [{ name: 'ChemCraft Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ChemCraft'
  },
  icons: {
    icon: '/favicon.ico'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChemCraft" />
      </head>
      <body className={`${inter.className} bg-slate-900 text-slate-100`} suppressHydrationWarning>
        <ThemeProvider>
          <ClerkProvider>
            <ErrorBoundary>
              <ChemicalBackground />
              <div className="relative min-h-screen flex flex-col">
                {/* Overlay for text contrast over the 3D background */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10 pointer-events-none"></div>
                
                {/* Main content */}
                <div className="relative z-20 flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1 container mx-auto px-4 py-8">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
            </ErrorBoundary>
          </ClerkProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />
      </body>
    </html>
  )
}
