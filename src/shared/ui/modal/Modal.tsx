import { useEffect } from 'react';
import type { ReactNode } from 'react';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="modal">
      <div 
        className="modal__overlay" 
        onClick={onClose}
        onKeyDown={handleOverlayKeyDown}
        role="button"
        tabIndex={0}
      />
      <div className="modal__content">
        {children}
      </div>
    </div>
  );
};
