import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mini Render Dashboard',
  description: 'A $0 MVP deployment platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <nav className="border-b border-gray-800 bg-black sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="font-bold text-xl tracking-tight text-white">Mini Render</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
                <a href="http://localhost:4000/api/auth/github" className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors">
                  Login with GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
