// Simulación del componente MockDashboard (reemplazar con tu componente real)
export default function MockDashboard() {
  return (
    <div className="relative max-w-lg mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />
      <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Browser Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-gray-700/50 rounded-md px-3 py-1 text-xs text-gray-400 text-center">
              www.tuempresa.com
            </div>
          </div>
        </div>

        {/* Website Content */}
        <div className="p-6 space-y-6">
          
          {/* Header Section */}
          <div className="space-y-3">
            <div className="h-6 bg-white/20 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-white/15 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/15 rounded w-4/5 animate-pulse" />
            <div className="flex gap-2 mt-4">
              <div className="h-8 bg-blue-500/40 rounded w-20 animate-pulse" />
              <div className="h-8 bg-white/20 rounded w-24 animate-pulse" />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/10 rounded-lg p-3 space-y-2 animate-pulse">
                <div className="w-8 h-8 bg-white/20 rounded-full" />
                <div className="h-3 bg-white/15 rounded w-full" />
                <div className="h-3 bg-white/15 rounded w-3/4" />
              </div>
            ))}
          </div>

          {/* Chart/Dashboard Section */}
          <div className="bg-white/10 rounded-lg p-4 space-y-3 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/2" />
            <div className="relative h-24 bg-white/5 rounded overflow-hidden">
              <div className="absolute bottom-0 left-0 w-1/6 h-3/4 bg-blue-500/40 rounded-t"></div>
              <div className="absolute bottom-0 left-1/6 w-1/6 h-1/2 bg-blue-500/30 rounded-t"></div>
              <div className="absolute bottom-0 left-2/6 w-1/6 h-full bg-blue-500/50 rounded-t"></div>
              <div className="absolute bottom-0 left-3/6 w-1/6 h-2/3 bg-blue-500/35 rounded-t"></div>
              <div className="absolute bottom-0 left-4/6 w-1/6 h-4/5 bg-blue-500/45 rounded-t"></div>
              <div className="absolute bottom-0 left-5/6 w-1/6 h-1/3 bg-blue-500/25 rounded-t"></div>
            </div>
            <div className="flex justify-between">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((month, i) => (
                <span key={i} className="text-xs text-gray-500">{month}</span>
              ))}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <div className="text-center">
              <div className="h-3 bg-white/20 rounded w-8 mx-auto animate-pulse" />
              <div className="text-xs text-gray-500 mt-1">Usuarios</div>
            </div>
            <div className="text-center">
              <div className="h-3 bg-white/20 rounded w-10 mx-auto animate-pulse" />
              <div className="text-xs text-gray-500 mt-1">Ventas</div>
            </div>
            <div className="text-center">
              <div className="h-3 bg-white/20 rounded w-6 mx-auto animate-pulse" />
              <div className="text-xs text-gray-500 mt-1">ROI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
