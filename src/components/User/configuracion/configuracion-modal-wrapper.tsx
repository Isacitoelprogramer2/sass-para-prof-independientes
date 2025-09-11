"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import ConfiguracionModal from './dialog_configuracion';
import { useConfiguracionModal } from '@/contexts/configuracion-modal-context';

export const ConfiguracionModalWrapper = () => {
  const { isConfiguracionModalOpen, closeConfiguracionModal } = useConfiguracionModal();

  if (typeof window === 'undefined') return null;

  return createPortal(
    <ConfiguracionModal 
      isOpen={isConfiguracionModalOpen} 
      onClose={closeConfiguracionModal} 
    />,
    document.body
  );
};