"use client"
import { useState, useEffect } from 'react'
import { GitBranch, Rocket, Server, Github, CheckCircle2, Search, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewProjectPage() {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
    fetch(`${apiUrl}/api/github/repos`)
      .then(res => res.json())
      .then(data => {
        setRepos(data.repos || [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load GitHub repositories')
        setLoading(false)
      })
  }, [])

  const handleDeploy = async (repoUrl: string) => {
    setDeploying(true)
    const toastId = toast.loading('Initializing deployment engine...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
      const res = await fetch(`${apiUrl}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, branch: 'main' })
      })
      
      if (!res.ok) throw new Error('Deploy failed')
      
      const data = await res.json()
      toast.success('Deployment started successfully!', { id: toastId })
      
      setTimeout(() => {
        window.location.href = `/project/${data.project.id}`
      }, 1000)
    } catch (e) {
      toast.error('Failed to start deployment', { id: toastId })
      setDeploying(false)
    }
  }

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Web Service</h1>
        <p className="text-gray-500">Connect a repository from GitHub. We'll automatically build and deploy it.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Github size={20} /> Connect a repository
          </h2>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-gray-900 shadow-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              Loading repositories from GitHub...
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No repositories found. Ensure you have granted access to your GitHub account.
            </div>
          ) : (
            filteredRepos.map(repo => (
              <div key={repo.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <GitBranch size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{repo.full_name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      {repo.private ? (
                        <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">Private</span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-medium">Public</span>
                      )}
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeploy(repo.html_url)}
                  disabled={deploying}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  Connect <ArrowRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-blue-600" /> What happens next?
        </h3>
        <p className="text-sm text-blue-800">
          When you connect a repository, Mini Render will automatically detect the language (Node.js/React), build a Docker container, and deploy it to a secure cloud server. We will automatically generate a domain for you and set up SSL.
        </p>
      </div>
    </div>
  )
}
