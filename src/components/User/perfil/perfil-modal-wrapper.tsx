"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import PerfilModal from './perfil-modal';
import { ConfirmationModal, useConfirmationModal } from '@/components/application/modals';
import { useProfileModal } from '@/contexts/profile-modal-context';

export const PerfilModalWrapper = () => {
  const { isProfileModalOpen, closeProfileModal } = useProfileModal();
  
  // Hook para manejar el modal de confirmación
  const confirmationModal = useConfirmationModal();

  if (typeof window === 'undefined') return null;

  return createPortal(
    <>
      <PerfilModal 
        isOpen={isProfileModalOpen} 
        onClose={closeProfileModal}
        onShowSuccess={confirmationModal.showSuccess}
        onShowError={confirmationModal.showError}
      />
      
      {/* Modal de confirmación en la capa más alta */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={confirmationModal.closeModal}
        type={confirmationModal.type}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
    </>,
    document.body
  );
};