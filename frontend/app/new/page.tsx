"use client"
import { useState, useEffect } from 'react'

export default function NewDeploymentPage() {
  const [repos, setRepos] = useState<any[]>([])
  const [selectedRepo, setSelectedRepo] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch mock repositories from backend
    fetch('http://localhost:4000/api/github/repos')
      .then(res => res.json())
      .then(data => {
        setRepos(data.repos || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleDeploy = async () => {
    setDeploying(true)
    try {
      const res = await fetch('http://localhost:4000/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: selectedRepo, branch: 'main' })
      })
      const data = await res.json()
      alert(data.message)
      window.location.href = '/dashboard'
    } catch (e) {
      alert('Failed to deploy')
      setDeploying(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Deploy a new project</h1>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Select Repository</h2>
        <div className="mb-6">
          {loading ? (
            <div className="text-gray-400">Loading repositories...</div>
          ) : (
            <div className="space-y-2">
              {repos.map(repo => (
                <div 
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo.url)}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${selectedRepo === repo.url ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-black hover:border-gray-500'}`}
                >
                  <span className="font-medium text-white">{repo.name}</span>
                  <div className="text-sm text-gray-400 mt-1">{repo.url}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-xl font-semibold mb-4">Build Settings</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Framework</label>
              <select className="w-full bg-black border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                <option>Node.js</option>
                <option>Docker</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDeploy}
          disabled={!selectedRepo || deploying}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          {deploying ? 'Deploying...' : 'Deploy'}
        </button>
      </div>
    </div>
  )
}
