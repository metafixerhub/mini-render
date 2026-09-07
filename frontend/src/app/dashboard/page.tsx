"use client"
import { useState, useEffect } from 'react'
import { Search, Plus, GitBranch, Github, ExternalLink, Activity, CheckCircle2, ChevronDown, LayoutGrid, List } from 'lucide-react'

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-semibold text-white tracking-tight">All Projects</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search Projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <a href="/new" className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded-md font-medium transition-colors text-sm whitespace-nowrap">
            Add New <ChevronDown size={14} />
          </a>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/[0.02] border border-white/10 rounded-xl h-48 animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <Github size={48} className="text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6 text-sm">Deploy your first project from GitHub to get started.</p>
          <a href="/new" className="bg-white text-black px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors">
            Import Project
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const latestDep = project.deployments?.[0]
            const isLive = latestDep?.status === 'LIVE'
            const isBuilding = latestDep?.status === 'BUILDING'
            
            return (
              <a href={`/project/${project.id}`} key={project.id} className="bg-black border border-white/10 rounded-xl p-5 hover:border-white/30 transition-colors group flex flex-col justify-between h-48">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm group-hover:underline">{project.name}</h3>
                        <div className="text-gray-500 text-xs mt-0.5">{project.name}.vercel.app</div>
                      </div>
                    </div>
                    {isLive ? (
                      <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    ) : isBuilding ? (
                      <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                        <Activity size={12} className="text-yellow-500 animate-spin" />
                      </div>
                    ) : null}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-mono truncate">
                    <GitBranch size={12} />
                    {project.repoUrl.replace('https://github.com/', '')}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Just now</span>
                    <span>Production</span>
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
