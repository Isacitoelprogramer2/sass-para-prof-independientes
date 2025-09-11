"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfiguracionModalContextType {
  isConfiguracionModalOpen: boolean;
  openConfiguracionModal: () => void;
  closeConfiguracionModal: () => void;
}

const ConfiguracionModalContext = createContext<ConfiguracionModalContextType | undefined>(undefined);

export const ConfiguracionModalProvider = ({ children }: { children: ReactNode }) => {
  const [isConfiguracionModalOpen, setIsConfiguracionModalOpen] = useState(false);

  const openConfiguracionModal = () => setIsConfiguracionModalOpen(true);
  const closeConfiguracionModal = () => setIsConfiguracionModalOpen(false);

  return (
    <ConfiguracionModalContext.Provider value={{ 
      isConfiguracionModalOpen, 
      openConfiguracionModal, 
      closeConfiguracionModal 
    }}>
      {children}
    </ConfiguracionModalContext.Provider>
  );
};

export const useConfiguracionModal = () => {
  const context = useContext(ConfiguracionModalContext);
  if (context === undefined) {
    throw new Error('useConfiguracionModal must be used within a ConfiguracionModalProvider');
  }
  return context;
};