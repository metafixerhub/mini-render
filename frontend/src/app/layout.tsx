import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mini Render Dashboard',
  description: 'A $0 MVP deployment platform',
}

import { Toaster } from 'react-hot-toast'
import { Rocket, GitBranch } from 'lucide-react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-white min-h-screen selection:bg-blue-500/30">
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } }} />
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <Rocket size={20} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">Mini Render</span>
              </a>
              <div className="flex items-center gap-6">
                <a href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">Dashboard</a>
                <a href={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github` : "http://localhost:4000/api/auth/github"} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium transition-all text-sm border border-white/10">
                  <GitBranch size={16} />
                  Login
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          {children}
        </main>
      </body>
    </html>
  )
}
