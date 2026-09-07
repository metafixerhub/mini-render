"use client"
import { useState, useEffect } from 'react'
import { GitBranch, Code, Search, Settings, ChevronDown, CheckCircle2, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewProjectPage() {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // State for the configuration step
  const [selectedRepo, setSelectedRepo] = useState<any>(null)
  const [projectName, setProjectName] = useState('')

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

  const handleSelectRepo = (repo: any) => {
    setSelectedRepo(repo)
    setProjectName(repo.name)
  }

  const handleDeploy = async () => {
    setDeploying(true)
    const toastId = toast.loading('Starting deployment...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
      const res = await fetch(`${apiUrl}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: selectedRepo.html_url, branch: 'main', projectName })
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

  if (selectedRepo) {
    return (
      <div className="max-w-3xl mx-auto pb-20">
        <div className="mb-8">
          <button onClick={() => setSelectedRepo(null)} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6">
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">You're almost done.</h1>
          <p className="text-gray-400 text-lg">Please follow the steps to configure your Project and deploy it.</p>
        </div>

        <div className="bg-black border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="p-6 flex items-center gap-4 border-b border-white/10">
            <div className="bg-white/10 p-3 rounded-lg">
              <GitBranch size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedRepo.full_name}</h2>
              <p className="text-sm text-gray-500">App deployed to Mini Render.</p>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">Project Name</h3>
              <input 
                type="text" 
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-white/30 outline-none"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">Framework Preset</h3>
              <select disabled className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-400 outline-none appearance-none cursor-not-allowed">
                <option>Other (Auto-detect via Docker)</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">Root Directory</h3>
              <input 
                type="text" 
                disabled
                placeholder="./"
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-400 outline-none cursor-not-allowed"
              />
            </div>
            
            <div className="border border-white/10 rounded-md">
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                <span className="text-sm font-medium text-gray-200">Environment Variables</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
              <div className="p-4 bg-black">
                <p className="text-xs text-gray-500">You can add environment variables after deployment in the Project Settings.</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end">
            <button 
              onClick={handleDeploy}
              disabled={deploying}
              className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 px-6 py-2 rounded-md font-medium text-sm transition-colors"
            >
              {deploying ? 'Deploying...' : 'Deploy'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Let's build something new.</h1>
        <p className="text-gray-400 text-lg">To deploy a new Project, import an existing Git Repository or get started with a Template.</p>
      </div>

      <div className="bg-black border border-white/10 rounded-xl overflow-hidden mb-8">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <Code size={20} /> Import Git Repository
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white outline-none focus:border-white/30"
            />
          </div>
        </div>

        <div className="divide-y divide-white/10 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20 mb-4"></div>
              Loading repositories...
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No repositories found.
            </div>
          ) : (
            filteredRepos.map(repo => (
              <div key={repo.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/10 border border-white/5 flex items-center justify-center">
                    <Code size={16} className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">{repo.full_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleSelectRepo(repo)}
                  className="bg-white/10 text-white hover:bg-white/20 px-4 py-1.5 rounded-md font-medium text-sm transition-colors border border-white/5"
                >
                  Import
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
