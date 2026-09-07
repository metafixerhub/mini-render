import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mini Render Dashboard',
  description: 'A $0 MVP deployment platform',
}

import { Toaster } from 'react-hot-toast'
import { Rocket, GitBranch, LayoutDashboard, Settings, BookOpen, LogOut } from 'lucide-react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen font-sans selection:bg-blue-500/30 flex">
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff', border: '1px solid #222' } }} />
        
        {/* Render-style Dark Sidebar */}
        <div className="w-64 bg-[#111827] text-gray-300 flex flex-col fixed inset-y-0 z-50">
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <a href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1 rounded group-hover:bg-blue-500 transition-colors">
                <Rocket size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">Mini Render</span>
            </a>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-gray-800 text-white">
              <LayoutDashboard size={18} className="text-gray-400" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors">
              <BookOpen size={18} className="text-gray-400" />
              Docs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors">
              <Settings size={18} className="text-gray-400" />
              Settings
            </a>
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <a href={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github` : "https://backend-mini-render.vercel.app/api/auth/github"} className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors">
              <span className="flex items-center gap-3">
                <GitBranch size={18} className="text-gray-400" />
                Login / Auth
              </span>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-40">
            <div className="flex-1 flex items-center text-sm text-gray-500">
              {/* Breadcrumbs placeholder */}
              <span>Account</span>
              <span className="mx-2">/</span>
              <span className="font-medium text-gray-900">Dashboard</span>
            </div>
          </header>
          
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
