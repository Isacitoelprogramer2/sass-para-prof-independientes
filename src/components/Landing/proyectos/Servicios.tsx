import { useState } from 'react';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'websites', label: 'Websites' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'saas', label: 'SaaS' },
    { id: 'erp', label: 'ERP / Sistemas' }
  ];

  const projects = [
    {
      id: 1,
      category: 'ecommerce',
      badge: 'E-commerce',
      title: 'Entupunto.pe',
      description: 'Venta de bordados personalizados',
      image: 'https://via.placeholder.com/400x300/0f172a/64748b?text=TechStore',
      featured: true
    },
    {
      id: 2,
      category: 'saas',
      badge: 'SaaS',
      title: 'CloudSync Manager',
      description: 'Dashboard intuitivo para gestión de equipos remotos. 10k+ usuarios.',
      image: 'https://via.placeholder.com/400x300/1e293b/64748b?text=CloudSync'
    },
    {
      id: 3,
      category: 'erp',
      badge: 'ERP',
      title: 'Gloria Foods ERP',
      description: 'Sistema interno para inventario y pedidos. +40% eficiencia operativa.',
      image: 'https://via.placeholder.com/400x300/0f172a/64748b?text=Gloria+ERP'
    },
    {
      id: 4,
      category: 'websites',
      badge: 'Website',
      title: 'Studio Arquitectura',
      description: 'Portfolio inmersivo con animaciones 3D. Premio diseño 2024.',
      image: 'https://via.placeholder.com/400x300/1e293b/64748b?text=Studio',
      featured: true
    },
    {
      id: 5,
      category: 'ecommerce',
      badge: 'E-commerce',
      title: 'Fashion Boutique',
      description: 'Tienda con realidad aumentada. Ventas +200% primer trimestre.',
      image: 'https://via.placeholder.com/400x300/0f172a/64748b?text=Fashion'
    },
    {
      id: 6,
      category: 'saas',
      badge: 'SaaS',
      title: 'TaskFlow Pro',
      description: 'Automatización de workflows empresariales. ROI 300% en 6 meses.',
      image: 'https://via.placeholder.com/400x300/1e293b/64748b?text=TaskFlow'
    }
  ];

  const filteredProjects = activeFilter === 'todos' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Transformamos ideas en plataformas<br />
            digitales que <span className="text-blue-400">venden y escalan</span>
          </h1>
          <p className="text-blue-200/70 text-lg md:text-xl max-w-3xl mx-auto">
            Sitios web modernos, e-commerce de alto rendimiento, SaaS intuitivos y ERPs personalizados.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === cat.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white/5 text-blue-200/70 hover:bg-white/10 hover:text-white border border-white/10 hover:scale-105'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid - Improved Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-blue-400/50 transition-all duration-700 hover:transform hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/20 ${
                project.featured ? 'md:col-span-1 xl:col-span-2 xl:row-span-1' : ''
              }`}
              style={{
                animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`
              }}
            >
              {/* Image Container */}
              <div className={`relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 ${
                project.featured ? 'h-64 xl:h-80' : 'h-56'
              }`}>
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                {/* Badge */}
                <span className="absolute top-6 left-6 px-4 py-2 bg-blue-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-blue-400/20">
                  {project.badge}
                </span>

                {/* Featured Badge */}
                {project.featured && (
                  <span className="absolute top-6 right-6 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-100/10 text-white text-xs font-bold rounded-full shadow-lg">
                    DESTACADO
                  </span>
                )}
                
                {/* Floating Elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-300 rounded-full animate-ping" />
                </div>
              </div>

              {/* Content */}
              <div className={`p-8 ${project.featured ? 'xl:p-10' : ''}`}>
                <h3 className={`font-bold text-white mb-3 group-hover:text-blue-400 transition-colors ${
                  project.featured ? 'text-2xl xl:text-3xl' : 'text-xl'
                }`}>
                  {project.title}
                </h3>
                <p className={`text-blue-200/60 leading-relaxed mb-6 ${
                  project.featured ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'
                }`}>
                  {project.description}
                </p>
                
                {/* Stats or Tags (for featured items) */}
                {project.featured && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-white/10 text-blue-200 text-xs rounded-full">Next.js</span>
                    <span className="px-3 py-1 bg-white/10 text-blue-200 text-xs rounded-full">React.js</span>
                    <span className="px-3 py-1 bg-white/10 text-blue-200 text-xs rounded-full">Firebase</span>
                  </div>
                )}
                
                {/* CTA Button */}
                <button className="group/btn flex items-center gap-3 text-blue-400 hover:text-blue-300 font-semibold transition-all duration-300 hover:gap-4">
                  <span>Ver caso completo</span>
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full group-hover/btn:bg-blue-500/30 transition-all duration-300">
                    <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Enhanced Hover Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
