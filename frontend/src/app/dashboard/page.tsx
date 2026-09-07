"use client"
import { useState, useEffect } from 'react'

import { Plus, Server, GitBranch, ExternalLink, Activity } from 'lucide-react'

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
    fetch(`${apiUrl}/api/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Your Services</h1>
          <p className="text-gray-400">Manage and monitor your deployments</p>
        </div>
        <a href="/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]">
          <Plus size={20} />
          New Service
        </a>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-white/10 rounded w-32"></div>
                <div className="h-5 bg-white/10 rounded w-16"></div>
              </div>
              <div className="h-4 bg-white/5 rounded w-48 mb-6"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-white/5 rounded w-20"></div>
                <div className="h-4 bg-white/5 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl border-dashed">
          <div className="bg-white/5 p-4 rounded-full mb-4">
            <Server size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No services deployed yet</h3>
          <p className="text-gray-400 mb-6 text-center max-w-sm">Connect a GitHub repository and ship your first service to production in seconds.</p>
          <a href="/new" className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform">
            Deploy Now
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const latestDep = project.deployments?.[0]
            const isLive = latestDep?.status === 'LIVE'
            const isBuilding = latestDep?.status === 'BUILDING'
            const isFailed = latestDep?.status === 'FAILED'
            
            return (
              <a href={`/project/${project.id}`} key={project.id} className="block relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{project.name}</h3>
                    {isLive && <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-500/20 font-medium tracking-wide"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />LIVE</span>}
                    {isBuilding && <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 text-xs px-2.5 py-1 rounded-full border border-yellow-500/20 font-medium tracking-wide animate-pulse"><Activity size={12} />BUILDING</span>}
                    {isFailed && <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full border border-red-500/20 font-medium tracking-wide">FAILED</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-mono bg-white/5 px-3 py-1.5 rounded-md w-fit">
                    <GitBranch size={14} />
                    {project.repoUrl.replace('https://github.com/', '')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <Server size={14} /> Node.js
                    </span>
                    {isLive && latestDep.port && (
                      <span className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                        <ExternalLink size={14} /> localhost:{latestDep.port}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
