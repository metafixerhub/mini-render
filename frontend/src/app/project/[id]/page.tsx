"use client"
import { useState, useEffect } from 'react'
import { ExternalLink, GitBranch, Settings, RefreshCw, Activity, Terminal, Shield, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('events')
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
    const toastId = toast.loading('Triggering manual deploy...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
      const res = await fetch(`${apiUrl}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: project.repoUrl, branch: 'main' })
      })
      if (!res.ok) throw new Error('Deploy failed')
      
      toast.success('Deploy started', { id: toastId })
      setActiveTab('events')
    } catch (e) {
      toast.error('Failed to start deploy', { id: toastId })
    } finally {
      setDeploying(false)
      fetchProject()
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <Activity className="animate-spin text-gray-400" size={32} />
    </div>
  )
  
  if (!project) return (
    <div className="flex flex-col items-center py-20">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h3>
      <a href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</a>
    </div>
  )

  const latestDep = project.deployments?.[0]
  const isLive = latestDep?.status === 'LIVE'

  const tabs = [
    { id: 'events', label: 'Events' },
    { id: 'env', label: 'Environment' },
    { id: 'settings', label: 'Settings' }
  ]

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {isLive ? (
              <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded border border-green-200 font-medium">
                <CheckCircle2 size={12} /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded border border-yellow-200 font-medium">
                <Activity size={12} className="animate-pulse" /> Deploying
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <GitBranch size={14} />
              {project.repoUrl.replace('https://github.com/', '')}
            </a>
            {isLive && latestDep?.port && (
              <a href={`http://localhost:${latestDep.port}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                <ExternalLink size={14} />
                localhost:{latestDep.port}
              </a>
            )}
          </div>
        </div>
        <button 
          onClick={handleRedeploy}
          disabled={deploying}
          className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-all text-sm shadow-sm"
        >
          <RefreshCw size={14} className={deploying ? 'animate-spin' : ''} />
          Manual Deploy
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px]">
        {activeTab === 'events' && (
          <div className="p-0">
            {project.deployments?.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">No events yet. Deploy your project to see activity.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {project.deployments?.map((dep: any) => (
                  <li key={dep.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      {dep.status === 'LIVE' ? (
                        <CheckCircle2 className="text-green-500" size={20} />
                      ) : dep.status === 'FAILED' ? (
                        <XCircle className="text-red-500" size={20} />
                      ) : (
                        <Activity className="text-yellow-500 animate-spin" size={20} />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Deploy {dep.status === 'LIVE' ? 'succeeded' : dep.status === 'FAILED' ? 'failed' : 'started'}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">ID: {dep.id}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(dep.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'env' && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Environment Variables</h2>
            <p className="text-sm text-gray-500 mb-6">
              Environment variables are injected into your service at runtime.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3 mb-8">
              <input 
                type="text" 
                placeholder="Key (e.g. DATABASE_URL)" 
                value={envKey}
                onChange={e => setEnvKey(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 font-mono text-sm shadow-sm"
              />
              <input 
                type="text" 
                placeholder="Value" 
                value={envValue}
                onChange={e => setEnvValue(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 flex-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 font-mono text-sm shadow-sm"
              />
              <button 
                onClick={handleAddEnv}
                disabled={!envKey || !envValue}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 px-4 py-2 rounded-md font-medium text-white transition-colors text-sm shadow-sm"
              >
                Save
              </button>
            </div>

            <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium w-1/3">Key</th>
                  <th className="px-4 py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {project.envVars?.map((env: any) => (
                  <tr key={env.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-900">{env.key}</td>
                    <td className="px-4 py-3 font-mono text-gray-400">••••••••••••••••</td>
                  </tr>
                ))}
                {project.envVars?.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-gray-500">No environment variables set.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">General</h2>
            
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Project Name</h3>
                  <p className="text-sm text-gray-500">The name of your service on Mini Render.</p>
                </div>
                <div className="font-mono bg-gray-100 px-3 py-1.5 rounded text-sm text-gray-700 border border-gray-200">{project.name}</div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Repository</h3>
                  <p className="text-sm text-gray-500">The connected GitHub repository.</p>
                </div>
                <a href={project.repoUrl} target="_blank" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                  {project.repoUrl.replace('https://github.com/', '')} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <h2 className="text-lg font-bold text-red-600 mb-4 mt-12">Danger Zone</h2>
            <div className="border border-red-200 rounded-lg p-4 flex justify-between items-center bg-red-50">
              <div>
                <h3 className="font-medium text-red-900">Delete Service</h3>
                <p className="text-sm text-red-700">Once you delete a service, there is no going back.</p>
              </div>
              <button className="bg-white border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
