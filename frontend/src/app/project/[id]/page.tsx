"use client"
import { useState, useEffect } from 'react'
import { ExternalLink, GitBranch, Settings, Activity, CheckCircle2, XCircle, Github, Link, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)

  const fetchProject = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
    fetch(`${apiUrl}/api/projects/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data.project)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load project details')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProject()
    
    // Poll for updates if building
    const interval = setInterval(() => {
      setProject((current: any) => {
        if (current?.deployments?.[0]?.status === 'BUILDING') {
          fetchProject()
        }
        return current
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [params.id])

  if (loading) return (
    <div className="flex justify-center py-20">
      <Activity className="animate-spin text-gray-500" size={32} />
    </div>
  )
  
  if (!project) return (
    <div className="flex flex-col items-center py-20">
      <h3 className="text-xl font-medium text-white mb-2">Project Not Found</h3>
      <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Back to Dashboard</a>
    </div>
  )

  const latestDep = project.deployments?.[0]
  const isLive = latestDep?.status === 'LIVE'
  const isBuilding = latestDep?.status === 'BUILDING'
  const isFailed = latestDep?.status === 'FAILED'

  const handleRedeploy = async () => {
    setDeploying(true)
    const toastId = toast.loading('Starting deployment...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
      const res = await fetch(`${apiUrl}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: project.repoUrl, branch: 'main' })
      })
      if (!res.ok) throw new Error('Deploy failed')
      toast.success('Deploy started', { id: toastId })
    } catch (e) {
      toast.error('Failed to start deploy', { id: toastId })
    } finally {
      setDeploying(false)
      fetchProject()
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
        <div className="flex gap-3">
          <button className="bg-white/10 text-white border border-white/10 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/20 transition-colors">
            Domains
          </button>
          <a href={project.repoUrl} target="_blank" className="flex items-center gap-2 bg-white/10 text-white border border-white/10 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/20 transition-colors">
            <Github size={16} /> Repository
          </a>
        </div>
      </div>

      <div className="border-b border-white/10 mb-8">
        <nav className="flex gap-6">
          <button className="pb-3 text-sm font-medium border-b-2 border-white text-white">Project</button>
          <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300">Deployments</button>
          <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300">Analytics</button>
          <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300">Speed Insights</button>
          <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300">Settings</button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black border border-white/10 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="font-semibold text-white">Production Deployment</h2>
              <button onClick={handleRedeploy} disabled={deploying || isBuilding} className="text-sm bg-white text-black px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
                {deploying || isBuilding ? 'Deploying...' : 'Redeploy'}
              </button>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 aspect-video bg-[#111] border border-white/5 rounded-lg flex items-center justify-center p-4">
                {/* Simulated preview box */}
                <div className="text-xs font-mono text-gray-500 w-full h-full overflow-hidden">
                  <div className="text-blue-400 mb-2">Mini Render Live</div>
                  <div>Build starting...</div>
                  <div>Cloning repository...</div>
                  <div>Installing dependencies...</div>
                  {isLive && <div className="text-green-400 mt-2">Server running on port {latestDep?.port}</div>}
                  {isBuilding && <div className="text-yellow-400 mt-2 animate-pulse">Building container...</div>}
                </div>
              </div>
              
              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Deployment</h3>
                  <a href={`http://localhost:${latestDep?.port}`} target="_blank" className="text-white hover:underline text-sm font-medium flex items-center gap-1.5">
                    {project.name}-production.vercel.app <ExternalLink size={12} />
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Domains</h3>
                  <a href={`http://localhost:${latestDep?.port}`} target="_blank" className="text-white hover:underline text-sm font-medium flex items-center gap-1.5">
                    {project.name}.vercel.app <ExternalLink size={12} />
                  </a>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                    <div className="flex items-center gap-2">
                      {isLive && <><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" /><span className="text-sm text-white font-medium">Ready</span></>}
                      {isBuilding && <><Activity size={14} className="text-yellow-500 animate-spin" /><span className="text-sm text-white font-medium">Building</span></>}
                      {isFailed && <><span className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-sm text-white font-medium">Error</span></>}
                      {!latestDep && <span className="text-sm text-gray-500">None</span>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
                    <span className="text-sm text-white">
                      {latestDep ? new Date(latestDep.createdAt).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Source</h3>
                  <div className="text-sm text-white flex items-center gap-1.5 mb-1 font-mono">
                    <GitBranch size={14} /> main
                  </div>
                  <div className="text-sm text-gray-400 font-mono truncate">
                    -o- Initial commit
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/[0.02]">
              <h2 className="font-semibold text-white">Deployment Settings</h2>
            </div>
            <div className="p-6">
               <p className="text-sm text-gray-400">Settings and environment variables can be configured here.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-black border border-white/10 rounded-xl p-6">
             <h2 className="font-semibold text-white mb-4">Branch Deployments</h2>
             <p className="text-sm text-gray-500 mb-4">Every push to a branch automatically creates a new deployment.</p>
             <button className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors">
               View All Branches
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
