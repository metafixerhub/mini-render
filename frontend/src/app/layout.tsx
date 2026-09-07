import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mini Render | Vercel Style',
  description: 'A $0 MVP deployment platform',
}

import { Toaster } from 'react-hot-toast'
import { Rocket, GitBranch, LayoutDashboard, Settings, Box, Activity, Search, Bell } from 'lucide-react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-gray-200 min-h-screen font-sans selection:bg-white/20 flex flex-col md:flex-row">
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid #333' } }} />
        
        {/* Vercel-style Dark Sidebar */}
        <div className="w-full md:w-64 bg-black border-r border-white/10 flex flex-col md:fixed md:inset-y-0 z-50">
          <div className="h-16 flex items-center px-4 border-b border-white/10 justify-between md:justify-start">
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-black transform rotate-45" />
              </div>
              <span className="font-medium text-sm text-white">metafixerhub's p...</span>
              <span className="bg-white/10 text-gray-300 text-[10px] font-mono px-1.5 py-0.5 rounded ml-2">Hobby</span>
            </a>
          </div>
          
          <div className="p-4 border-b border-white/10 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Find"
                className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white outline-none focus:border-white/20 transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 text-gray-400 text-[10px] px-1.5 py-0.5 rounded">F</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 hidden md:block space-y-0.5 px-3">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Overview</div>
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-1.5 text-sm font-medium rounded-md bg-white/10 text-white">
              <Box size={16} className="text-gray-400" />
              Projects
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Activity size={16} className="text-gray-400" />
              Deployments
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <LayoutDashboard size={16} className="text-gray-400" />
              Logs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Settings size={16} className="text-gray-400" />
              Settings
            </a>
          </div>
          
          <div className="p-4 border-t border-white/10 hidden md:flex items-center justify-between">
            <a href={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github` : "https://backend-mini-render.vercel.app/api/auth/github"} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <GitBranch size={16} /> Login
            </a>
            <Bell size={16} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-black">
          {/* Top Header */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40 bg-black/80 backdrop-blur-md">
            <div className="flex items-center text-sm font-medium text-white">
              Overview
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">Feedback</span>
              <span className="hover:text-white cursor-pointer transition-colors">Help</span>
            </div>
          </header>
          
          <main className="flex-1 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
