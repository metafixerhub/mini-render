export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        Deploy Your Apps in Seconds
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mb-10">
        The easiest way to host your Node.js, React, Next.js, and static sites. Zero configuration required. Just connect your GitHub repository and we handle the rest.
      </p>
      <div className="flex gap-4">
        <a href={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github` : "http://localhost:4000/api/auth/github"} className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform">
          Start Deploying for Free
        </a>
        <a href="#features" className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-700 transition-colors">
          View Documentation
        </a>
      </div>
      
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            🚀
          </div>
          <h3 className="text-xl font-bold mb-2">Auto Deploy</h3>
          <p className="text-gray-400">Push to GitHub and your app updates automatically. Zero downtime.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            🐳
          </div>
          <h3 className="text-xl font-bold mb-2">Docker Native</h3>
          <p className="text-gray-400">Everything runs in isolated containers. Maximum security and performance.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            💸
          </div>
          <h3 className="text-xl font-bold mb-2">Always Free</h3>
          <p className="text-gray-400">Build your MVP for $0. Scale up only when you need to.</p>
        </div>
      </div>
    </div>
  )
}
