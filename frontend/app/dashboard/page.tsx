export default function DashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Services</h1>
        <a href="/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors">
          + New Service
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Data Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">hello-world</h3>
            <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">LIVE</span>
          </div>
          <p className="text-sm text-gray-400 mb-4 font-mono">nur/hello-world</p>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span className="flex items-center gap-1">🟢 Node.js</span>
            <a href="http://localhost:8081" target="_blank" className="hover:text-white transition-colors">localhost:8081</a>
          </div>
        </div>
      </div>
    </div>
  )
}
