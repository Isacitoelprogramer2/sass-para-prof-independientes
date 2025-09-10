"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import PerfilModal from './perfil-modal';
import { useProfileModal } from '@/contexts/profile-modal-context';

export const PerfilModalWrapper = () => {
  const { isProfileModalOpen, closeProfileModal } = useProfileModal();

  if (typeof window === 'undefined') return null;

  return createPortal(
    <PerfilModal 
      isOpen={isProfileModalOpen} 
      onClose={closeProfileModal} 
    />,
    document.body
  );
};