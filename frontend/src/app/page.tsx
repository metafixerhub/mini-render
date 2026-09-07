import { Rocket, Zap, Server, Shield, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative max-w-5xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8 border border-blue-100">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        Mini Render is Live
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 max-w-4xl leading-tight">
        Build, deploy, and host your apps <span className="text-blue-600">instantly.</span>
      </h1>
      
      <p className="text-xl text-gray-600 max-w-2xl mb-12">
        The unified cloud to build and run all your apps and websites with free TLS certificates, global CDN, private networks and auto deploys from Git.
      </p>
      
      <div className="flex gap-4 mb-24">
        <a href={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github` : "https://backend-mini-render.vercel.app/api/auth/github"} className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-3.5 rounded-md font-bold text-lg transition-colors shadow-sm">
          Get Started for Free
          <ArrowRight size={20} />
        </a>
      </div>
      
      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full mt-12 border-t border-gray-200 pt-16">
        <div>
          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="text-gray-900" size={20} />
          </div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Auto Deploy from Git</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Connect your GitHub repository and we'll automatically build and deploy every time you push code.</p>
        </div>
        <div>
          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <Server className="text-gray-900" size={20} />
          </div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Native Containerization</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Everything runs in Docker. We automatically detect your framework and generate a secure container.</p>
        </div>
        <div>
          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="text-gray-900" size={20} />
          </div>
          <h3 className="text-lg font-bold mb-2 text-gray-900">Free Tier</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Host your MVP completely free forever. Our infrastructure runs on highly scalable resources.</p>
        </div>
      </div>
    </div>
  )
}
