"use client"
import { useState, useEffect } from 'react'
import { Plus, Server, GitBranch, ExternalLink, Activity, Clock, CheckCircle2, XCircle } from 'lucide-react'

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <a href="/new" className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm shadow-sm">
          <Plus size={16} />
          New
        </a>
      </div>
      
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 text-center text-gray-500 text-sm py-12 flex flex-col items-center justify-center">
            <Activity className="animate-spin text-gray-300 mb-3" size={24} />
            Loading services...
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4 border border-gray-100">
            <Server size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No services deployed yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm text-sm">Connect a GitHub repository and deploy your first web service in minutes.</p>
          <a href="/new" className="bg-[#6366f1] text-white px-6 py-2 rounded-md font-medium hover:bg-[#4f46e5] transition-colors text-sm shadow-sm">
            Deploy your first service
          </a>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Branch</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Last Deployed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(project => {
                const latestDep = project.deployments?.[0]
                const isLive = latestDep?.status === 'LIVE'
                const isBuilding = latestDep?.status === 'BUILDING'
                const isFailed = latestDep?.status === 'FAILED'
                
                return (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => window.location.href = `/project/${project.id}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <Server size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</div>
                          {isLive && latestDep.port && (
                            <a href={`http://localhost:${latestDep.port}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
                              <ExternalLink size={10} /> localhost:{latestDep.port}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Web Service</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 font-mono text-xs bg-gray-100 px-2 py-1 rounded w-fit border border-gray-200">
                        <GitBranch size={12} />
                        main
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isLive && (
                        <div className="flex items-center gap-1.5 text-green-700 text-xs font-medium">
                          <CheckCircle2 size={14} className="text-green-500" /> Deploy succeeded
                        </div>
                      )}
                      {isBuilding && (
                        <div className="flex items-center gap-1.5 text-yellow-700 text-xs font-medium">
                          <Activity size={14} className="text-yellow-500 animate-pulse" /> Deploying...
                        </div>
                      )}
                      {isFailed && (
                        <div className="flex items-center gap-1.5 text-red-700 text-xs font-medium">
                          <XCircle size={14} className="text-red-500" /> Deploy failed
                        </div>
                      )}
                      {!latestDep && (
                        <span className="text-gray-400 text-xs">No deployments</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {latestDep ? new Date(latestDep.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
