/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      data-testid='confirmation-modal-overlay'
      onClick={onClose}
      className='confirmation-modal-overlay'
      aria-label='Close confirmation modal'
      role='presentation'>
      <div
        data-testid='confirmation-modal-content'
        role='dialog'
        aria-labelledby='confirmation-modal-title'
        aria-modal='true'
        onClick={handleModalContentClick}
        className='confirmation-modal'>
        <h2 id='confirmation-modal-title' className='confirmation-modal-header'>
          {title}
        </h2>
        <div className='confirmation-modal-message'>{children}</div>
        <div className='confirmation-modal-actions'>
          <button onClick={onClose} className='cancel-button'>
            Cancel
          </button>
          <button onClick={handleConfirm} className='confirm-button'>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
