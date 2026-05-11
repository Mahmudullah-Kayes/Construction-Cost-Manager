import { createContext, useContext, useState } from 'react';

/**
 * Modal Context
 * Provides global modal functions to all dashboard components
 */
const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger'
  });

  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success',
    duration: 3000
  });

  // Show confirmation modal
  const showConfirmModal = ({ 
    title, 
    message, 
    onConfirm, 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' 
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      type
    });
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Show toast notification
  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({
      isOpen: true,
      message,
      type,
      duration
    });
  };

  // Close toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  // Convenience methods
  const showSuccess = (message, duration) => showToast(message, 'success', duration);
  const showError = (message, duration) => showToast(message, 'error', duration);
  const showWarning = (message, duration) => showToast(message, 'warning', duration);
  const showInfo = (message, duration) => showToast(message, 'info', duration);

  const value = {
    // Confirm Modal
    confirmModal,
    showConfirmModal,
    closeConfirmModal,
    
    // Toast
    toast,
    showToast,
    closeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
