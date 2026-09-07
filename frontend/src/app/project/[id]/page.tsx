"use client"
import { useState, useEffect } from 'react'
import { Plus, ExternalLink, Activity, GitBranch, Settings, RefreshCw, Key, Shield, Clock, Terminal } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [envKey, setEnvKey] = useState('')
  const [envValue, setEnvValue] = useState('')
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
  }, [params.id])

  const handleAddEnv = async () => {
    const toastId = toast.loading('Saving environment variable...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
      const res = await fetch(`${apiUrl}/api/projects/${params.id}/env`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: envKey, value: envValue })
      })
      if (!res.ok) throw new Error('Failed to save')
      
      toast.success('Environment variable added', { id: toastId })
      setEnvKey('')
      setEnvValue('')
      fetchProject()
    } catch (e) {
      toast.error('Failed to save variable', { id: toastId })
    }
  }

  const handleRedeploy = async () => {
    setDeploying(true)
    const toastId = toast.loading('Triggering manual redeploy...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
      const res = await fetch(`${apiUrl}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: project.repoUrl, branch: 'main' })
      })
      if (!res.ok) throw new Error('Deploy failed')
      
      toast.success('Redeploy triggered successfully', { id: toastId })
    } catch (e) {
      toast.error('Failed to trigger redeploy', { id: toastId })
    } finally {
      setDeploying(false)
      fetchProject()
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="h-16 bg-white/5 rounded-2xl w-1/3"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl"></div>
        <div className="h-96 bg-white/5 rounded-2xl"></div>
      </div>
    </div>
  )
  
  if (!project) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <Activity size={32} className="text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Project Not Found</h3>
      <p className="text-gray-400 mb-6">This project may have been deleted or does not exist.</p>
      <a href="/dashboard" className="bg-white text-black px-6 py-2.5 rounded-full font-bold">Back to Dashboard</a>
    </div>
  )

  const latestDep = project.deployments?.[0]
  const isLive = latestDep?.status === 'LIVE'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-white">{project.name}</h1>
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-500/20 font-medium tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 text-xs px-2.5 py-1 rounded-full border border-yellow-500/20 font-medium tracking-wide">
                BUILDING
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <GitBranch size={16} />
              {project.repoUrl.replace('https://github.com/', '')}
            </a>
            {isLive && latestDep?.port && (
              <a href={`http://localhost:${latestDep.port}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                <ExternalLink size={16} />
                localhost:{latestDep.port}
              </a>
            )}
          </div>
        </div>
        <button 
          onClick={handleRedeploy}
          disabled={deploying}
          className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
        >
          <RefreshCw size={16} className={deploying ? 'animate-spin' : ''} />
          {deploying ? 'Deploying...' : 'Redeploy'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Environment Variables</h2>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              Securely store secrets and configuration. These are injected into your Docker container at runtime.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <input 
                type="text" 
                placeholder="KEY (e.g. DATABASE_URL)" 
                value={envKey}
                onChange={e => setEnvKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                className="bg-black border border-white/10 rounded-lg px-4 py-2.5 w-full sm:w-1/3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white font-mono text-sm"
              />
              <input 
                type="text" 
                placeholder="VALUE" 
                value={envValue}
                onChange={e => setEnvValue(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-4 py-2.5 flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white font-mono text-sm"
              />
              <button 
                onClick={handleAddEnv}
                disabled={!envKey || !envValue}
                className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-300 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-medium text-white transition-all sm:w-auto w-full"
              >
                <Plus size={18} />
                Save
              </button>
            </div>

            <div className="space-y-3">
              {project.envVars?.map((env: any) => (
                <div key={env.id} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg p-4 group hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-3 w-1/3">
                    <Key size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                    <span className="font-mono text-sm text-gray-300 truncate">{env.key}</span>
                  </div>
                  <span className="flex-1 font-mono text-sm text-gray-600 tracking-widest pl-4 border-l border-white/5">
                    ••••••••••••••••
                  </span>
                </div>
              ))}
              {project.envVars?.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-lg text-gray-500 text-sm">
                  No environment variables configured.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 relative">
              <Clock className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-white">Deployments</h2>
            </div>
            
            <div className="space-y-4 relative">
              {project.deployments?.map((dep: any, index: number) => (
                <div key={dep.id} className="relative pl-6 pb-4 border-l border-white/10 last:border-0 last:pb-0">
                  <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${dep.status === 'LIVE' ? 'bg-green-500' : dep.status === 'BUILDING' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
                  
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-gray-500">#{dep.id.substring(0, 8)}</span>
                      {dep.status === 'LIVE' && <span className="text-green-400 text-[10px] font-bold tracking-wider px-2 py-0.5 bg-green-400/10 rounded">LIVE</span>}
                      {dep.status === 'BUILDING' && <span className="text-yellow-400 text-[10px] font-bold tracking-wider px-2 py-0.5 bg-yellow-400/10 rounded animate-pulse">BUILDING</span>}
                      {dep.status === 'FAILED' && <span className="text-red-400 text-[10px] font-bold tracking-wider px-2 py-0.5 bg-red-400/10 rounded">FAILED</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Terminal size={14} className="text-gray-500" />
                      Production Build
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-white/5">
                      {new Date(dep.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {project.deployments?.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">No deployments yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
