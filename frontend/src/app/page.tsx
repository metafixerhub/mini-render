import { Rocket, Zap, Server, Shield, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-400 mb-8 backdrop-blur-md">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        Mini Render V1 is Live
      </div>

      <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-white max-w-4xl leading-tight">
        Ship your code to production in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">seconds.</span>
      </h1>
      
      <p className="text-xl text-gray-400 max-w-2xl mb-12">
        The ultimate zero-config $0 deployment platform. Connect your GitHub repository and watch your Node.js, React, and Docker apps go live instantly.
      </p>
      
      <div className="flex gap-4 mb-24">
        <a href={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github` : "http://localhost:4000/api/auth/github"} className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
          Start Deploying for Free
          <ArrowRight size={20} />
        </a>
        <a href="#features" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-md">
          View Documentation
        </a>
      </div>
      
      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full mt-12">
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors group">
          <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all border border-blue-500/20">
            <Zap className="text-blue-400" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Auto Deploy</h3>
          <p className="text-gray-400 leading-relaxed">Push to GitHub and your app updates automatically. We listen for webhooks and trigger seamless zero-downtime rebuilds.</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors group">
          <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all border border-purple-500/20">
            <Server className="text-purple-400" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Docker Native</h3>
          <p className="text-gray-400 leading-relaxed">Everything runs in isolated Docker containers. If you don't have a Dockerfile, we automatically generate one for you.</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors group">
          <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500/20 transition-all border border-green-500/20">
            <Shield className="text-green-400" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Always Free</h3>
          <p className="text-gray-400 leading-relaxed">Build and host your MVP for $0. Designed perfectly to run on Oracle Cloud's Always Free VPS tier.</p>
        </div>
      </div>
    </div>
  )
}
