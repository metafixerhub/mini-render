"use client"
import { useState, useEffect } from 'react'

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [envKey, setEnvKey] = useState('')
  const [envValue, setEnvValue] = useState('')
  const [deploying, setDeploying] = useState(false)

  const fetchProject = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    fetch(`${apiUrl}/api/projects/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data.project)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const handleAddEnv = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    await fetch(`${apiUrl}/api/projects/${params.id}/env`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: envKey, value: envValue })
    })
    setEnvKey('')
    setEnvValue('')
    fetchProject()
  }

  const handleRedeploy = async () => {
    setDeploying(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    await fetch(`${apiUrl}/api/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: project.repoUrl, branch: 'main' })
    })
    setDeploying(false)
    fetchProject()
  }

  if (loading) return <div>Loading...</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-400 mt-2">{project.repoUrl}</p>
        </div>
        <button 
          onClick={handleRedeploy}
          disabled={deploying}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {deploying ? 'Deploying...' : 'Redeploy'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="KEY" 
              value={envKey}
              onChange={e => setEnvKey(e.target.value)}
              className="bg-black border border-gray-700 rounded-md px-3 py-2 w-1/3 focus:border-blue-500 outline-none"
            />
            <input 
              type="text" 
              placeholder="VALUE" 
              value={envValue}
              onChange={e => setEnvValue(e.target.value)}
              className="bg-black border border-gray-700 rounded-md px-3 py-2 flex-1 focus:border-blue-500 outline-none"
            />
            <button 
              onClick={handleAddEnv}
              disabled={!envKey || !envValue}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 px-4 rounded-md font-medium"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {project.envVars?.map((env: any) => (
              <div key={env.id} className="flex bg-black border border-gray-800 rounded-md p-3">
                <span className="w-1/3 font-mono text-sm text-gray-400">{env.key}</span>
                <span className="flex-1 font-mono text-sm">********</span>
              </div>
            ))}
            {project.envVars?.length === 0 && (
              <div className="text-gray-500 text-sm">No environment variables set.</div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Deployments</h2>
          <div className="space-y-3">
            {project.deployments?.map((dep: any) => (
              <div key={dep.id} className="flex justify-between items-center bg-black border border-gray-800 rounded-md p-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-gray-300">#{dep.id}</span>
                    {dep.status === 'LIVE' && <span className="text-green-400 text-xs px-2 py-0.5 bg-green-400/10 rounded">LIVE</span>}
                    {dep.status === 'BUILDING' && <span className="text-yellow-400 text-xs px-2 py-0.5 bg-yellow-400/10 rounded animate-pulse">BUILDING</span>}
                    {dep.status === 'FAILED' && <span className="text-red-400 text-xs px-2 py-0.5 bg-red-400/10 rounded">FAILED</span>}
                  </div>
                  <div className="text-xs text-gray-500">{new Date(dep.createdAt).toLocaleString()}</div>
                </div>
                {dep.status === 'LIVE' && dep.port && (
                  <a href={`http://localhost:${dep.port}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                    Open App ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
