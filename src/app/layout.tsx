import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { SessionProvider } from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: { default: 'Silent Key Archive', template: '%s — Silent Key Archive' },
  description: 'A digital memorial for Australian amateur radio operators who have become silent keys.',
  openGraph: {
    siteName: 'Silent Key Archive',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <footer className="bg-[#182B42] text-white/60 text-sm py-8 mt-16">
            <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="font-serif text-white/80 text-base">Silent Key Archive</span>
                <p className="mt-1">Preserving the stories of VK amateur radio operators.</p>
              </div>
              <div className="text-right">
                <p>73 de the Archive</p>
                <p className="mt-1">silentkey.net.au</p>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
