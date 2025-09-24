'use client';
import React, {useState, use} from 'react';
import { Calendar } from '@untitledui/icons';
import { Usuario } from '@/types/usuario';
import { Servicio } from '@/types/servicio';
import { useUsuarioById } from '@/hooks/use-usuario-by-id';
import { useServiciosByUserId } from '@/hooks/use-servicios-by-user-id';

// Types
interface Comment {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
}

// Profile Header Component
const ProfileHeader: React.FC<{ profile: Usuario }> = ({ profile }) => {
  const specialties = [profile.datosNegocio.categoria, profile.datosNegocio.subcategoria].filter(s => s);
  const location = `${profile.datosProfesional.provincia || ''}${profile.datosProfesional.provincia && profile.datosProfesional.pais ? ', ' : ''}${profile.datosProfesional.pais || ''}`.trim() || profile.datosNegocio.ubicacion || '';
  const profileImage = profile.datosProfesional.fotoPerfil || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face';
  const coverImage = profile.datosNegocio.fotoPortada || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=400&fit=crop';

  return (
    <div className="w-full sm:max-w-7xl sm:mx-auto bg-slate-800 rounded-xl shadow-xl overflow-hidden">
      <div className="relative">
        <div 
          className="h-32 sm:h-48 md:h-56 w-full bg-slate-700 bg-cover bg-center" 
          style={{ backgroundImage: `url('${coverImage}')` }}
        ></div>
        <div className="absolute -bottom-10 sm:-bottom-12 md:-bottom-16 left-1/2 -translate-x-1/2">
          <div 
            className="w-30 h-30 sm:w-24 sm:h-24 md:w-42 md:h-42 rounded-full bg-cover bg-center border-4 border-slate-800 shadow-lg" 
            style={{ backgroundImage: `url('${profileImage}')` }}
          ></div>
        </div>
      </div>
      <div className="pt-12 sm:pt-16 md:pt-20 px-2.5 sm:px-6 md:px-8 pb-6 md:pb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">{profile.datosProfesional.nombres}</h2>
        <p className="text-sm sm:text-base text-slate-400 mt-1 text-center">{profile.datosProfesional.profesion}</p>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">{location}</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {specialties.map((specialty, index) => (
            <span key={index} className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
              {specialty}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base">
            Contactar
          </button>
          <button  className="bg-slate-700 items-center justify-center text-white flex px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-slate-600 transition-colors text-sm sm:text-base">
            <Calendar className="w-4 h-4 mr-1" />
            Agendar un servicio
          </button>
        </div>
      </div>
    </div>
  );
};

// Navigation Tabs Component
const NavigationTabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Acerca de', id: 'about' },
    { name: 'Servicios', id: 'services' },
    { name: 'Comentarios', id: 'comments' },
  ];

  return (
    <div className="w-full sm:max-w-7xl sm:mx-auto mt-6">
      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="border-b border-slate-700">
          <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
            <div className="flex min-w-full sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700/30'
                  } flex-1 sm:flex-initial whitespace-nowrap py-3 px-4 sm:px-6 md:px-8 border-b-2 font-medium text-sm sm:text-base transition-all`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard: React.FC<{ service: Servicio }> = ({ service }) => {
  return (
    <div className="bg-slate-700/50 rounded-lg p-2.5 sm:p-5 hover:bg-slate-700 transition-all duration-200 border border-slate-600/50 hover:border-slate-500">
      <div 
        className="w-full h-40 sm:h-48 rounded-lg bg-cover bg-center bg-slate-600 mb-4" 
        style={{ backgroundImage: `url('${service.imagen || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'}')` }}
      ></div>
      <div>
        <p className="text-xs sm:text-sm font-semibold text-blue-400 uppercase tracking-wide">Servicio</p>
        <h4 className="text-base sm:text-lg font-bold text-white mt-2 line-clamp-2">{service.nombre}</h4>
        <p className="text-sm text-slate-400 mt-2 line-clamp-3">{service.detalles || ''}</p>
        <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Ver más →
        </button>
      </div>
    </div>
  );
};

// Comment Card Component
const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
      <div className="flex items-start space-x-4">
        <div 
          className="w-10 h-10 rounded-full bg-cover bg-center bg-slate-600 flex-shrink-0" 
          style={{ backgroundImage: `url('${comment.avatar}')` }}
        ></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-white">{comment.name}</h4>
            <span className="text-xs text-slate-400">{comment.date}</span>
          </div>
          <div className="flex items-center mb-2">
            {renderStars(comment.rating)}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{comment.comment}</p>
        </div>
      </div>
    </div>
  );
};

// Services Section Component
const ServicesSection: React.FC<{ services: Servicio[] }> = ({ services }) => {
  return (
    <div className="w-full sm:max-w-7xl sm:mx-auto mt-6">
      <div className="bg-slate-900 rounded-xl shadow-xl p-2.5 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Servicios Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

// About Section Component
const AboutSection: React.FC<{ usuario: Usuario }> = ({ usuario }) => {
  return (
    <div className="w-full sm:max-w-7xl sm:mx-auto mt-6">
      <div className="bg-slate-800 rounded-xl shadow-xl p-2.5 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Acerca de</h3>
        <p className="text-slate-400 leading-relaxed">
          {usuario.datosNegocio.descripcion || 'Profesional de la salud con experiencia en su campo.'}
        </p>
      </div>
    </div>
  );
};

// Comments Section Component
const CommentsSection: React.FC = () => {
  // Mock data for comments
  const mockComments = [
    {
      id: 1,
      name: 'María González',
      date: '15 de septiembre de 2025',
      rating: 5,
      comment: 'Excelente atención médica. La Dra. Ramirez es muy profesional y atenta. Me sentí muy cómoda durante la consulta.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      date: '10 de septiembre de 2025',
      rating: 4,
      comment: 'Buen servicio, aunque tuve que esperar un poco. El diagnóstico fue acertado y las recomendaciones muy útiles.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Ana López',
      date: '5 de septiembre de 2025',
      rating: 5,
      comment: 'Muy satisfecha con el chequeo médico. La doctora explicó todo de manera clara y me dio consejos preventivos.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="w-full sm:max-w-7xl sm:mx-auto mt-6">
      <div className="bg-slate-800 rounded-xl shadow-xl p-2.5 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Comentarios</h3>
        <div className="space-y-4">
          {mockComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const Page: React.FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const [activeTab, setActiveTab] = useState('about');
  
  const resolvedParams = use(params);
  const { usuario, loading: loadingUsuario } = useUsuarioById(resolvedParams.id);
  const { servicios, loading: loadingServicios } = useServiciosByUserId(resolvedParams.id);

  if (loadingUsuario || loadingServicios) {
    return (
      <div className="bg-slate-950 min-h-screen font-sans flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="bg-slate-950 min-h-screen font-sans flex items-center justify-center">
        <div className="text-white">Usuario no encontrado</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen font-sans">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="relative flex min-h-screen w-full flex-col">
        <main className="flex-grow">
          <div className="w-full px-4 sm:px-6 lg:px-12 py-6 sm:py-8 md:py-10">
            <ProfileHeader profile={usuario} />
            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === 'about' && <AboutSection usuario={usuario} />}
            {activeTab === 'services' && <ServicesSection services={servicios} />}
            {activeTab === 'comments' && <CommentsSection />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;