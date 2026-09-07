"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GitBranch, Code, Settings, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewDeploymentPage() {
  const router = useRouter()
  const [repos, setRepos] = useState<any[]>([])
  const [selectedRepo, setSelectedRepo] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
    fetch(`${apiUrl}/api/github/repos`)
      .then(res => res.json())
      .then(data => {
        setRepos(data.repos || [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load repositories')
        setLoading(false)
      })
  }, [])

  const handleDeploy = async () => {
    setDeploying(true)
    const toastId = toast.loading('Initializing deployment engine...')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-mini-render.vercel.app'
      const res = await fetch(`${apiUrl}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: selectedRepo, branch: 'main' })
      })
      
      if (!res.ok) throw new Error('Deployment failed')
      
      toast.success('Deployment triggered successfully!', { id: toastId })
      router.push('/dashboard')
    } catch (e) {
      toast.error('Failed to trigger deployment', { id: toastId })
      setDeploying(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-3">Deploy a new project</h1>
        <p className="text-gray-400">Select a GitHub repository to import and deploy.</p>
      </div>
      
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
            <h2 className="text-xl font-semibold text-white">Import Git Repository</h2>
          </div>
          
          <div className="mb-8">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : repos.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/10">
                <GitBranch size={32} className="mx-auto text-gray-500 mb-3" />
                <p className="text-gray-400">No repositories found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {repos.map(repo => (
                  <div 
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo.url)}
                    className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedRepo === repo.url ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20 ring-offset-2 ring-offset-[#0a0a0a]' : 'border-white/10 bg-black hover:border-white/20 hover:bg-white/5'}`}
                  >
                    <GitBranch size={20} className={selectedRepo === repo.url ? 'text-blue-400' : 'text-gray-400'} />
                    <div className="overflow-hidden">
                      <span className="font-semibold text-white block truncate">{repo.name}</span>
                      <div className="text-xs text-gray-500 mt-1 truncate">{repo.url.replace('https://github.com/', '')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</div>
              <h2 className="text-xl font-semibold text-white">Configure Build</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Code size={16} /> Framework Preset
                </label>
                <select disabled className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none opacity-50 cursor-not-allowed">
                  <option>Docker / Node.js (Auto-detect)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Settings size={16} /> Root Directory
                </label>
                <input disabled type="text" placeholder="./" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 opacity-50 cursor-not-allowed" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border-t border-white/10 p-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">You can configure environment variables after deployment.</p>
          <button 
            onClick={handleDeploy}
            disabled={!selectedRepo || deploying}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]"
          >
            {deploying ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                Deploy
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
