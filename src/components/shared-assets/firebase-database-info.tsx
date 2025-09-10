'use client';

import { useEffect, useState } from 'react';

export default function FirebaseDatabaseInfo() {
  const [databaseInfo, setDatabaseInfo] = useState<{
    databaseId: string;
    environment: string;
    projectId: string;
  } | null>(null);

  useEffect(() => {
    const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)';
    const environment = process.env.NODE_ENV || 'development';
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unknown';
    
    setDatabaseInfo({
      databaseId,
      environment,
      projectId
    });
    
    // Log para debugging
    console.log('🔥 Firebase Database Config:', {
      databaseId,
      environment,
      projectId
    });
  }, []);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development' || !databaseInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs font-mono border border-gray-700 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-400 font-semibold">Firebase Status</span>
      </div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">DB:</span> 
          <span className="text-blue-400 ml-1">{databaseInfo.databaseId}</span>
        </div>
        <div>
          <span className="text-gray-400">Env:</span> 
          <span className="text-yellow-400 ml-1">{databaseInfo.environment}</span>
        </div>
        <div>
          <span className="text-gray-400">Project:</span> 
          <span className="text-purple-400 ml-1">{databaseInfo.projectId}</span>
        </div>
      </div>
    </div>
  );
}
