"use client"
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Services</h1>
        <a href="/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors">
          + New Service
        </a>
      </div>
      
      {loading ? (
        <div className="text-gray-400">Loading your services...</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-400">You don't have any services deployed yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const latestDep = project.deployments?.[0]
            const isLive = latestDep?.status === 'LIVE'
            const isBuilding = latestDep?.status === 'BUILDING'
            const isFailed = latestDep?.status === 'FAILED'
            
            return (
              <a href={`/project/${project.id}`} key={project.id} className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">{project.name}</h3>
                  {isLive && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">LIVE</span>}
                  {isBuilding && <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-500/20 animate-pulse">BUILDING</span>}
                  {isFailed && <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20">FAILED</span>}
                </div>
                <p className="text-sm text-gray-400 mb-4 font-mono">{project.repoUrl.replace('https://github.com/', '')}</p>
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <span className="flex items-center gap-1">🟢 Node.js</span>
                  {isLive && latestDep.port && (
                    <span className="hover:text-white transition-colors text-blue-400">
                      localhost:{latestDep.port}
                    </span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
