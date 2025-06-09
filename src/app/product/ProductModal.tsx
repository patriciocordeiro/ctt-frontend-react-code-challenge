/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { NewProductData } from '../../store/product/product.types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newProductData?: NewProductData) => void;
  title: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleInternalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        data-testid='modal-overlay'
        onClick={onClose}
        aria-label='Close modal'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          padding: 0,
          margin: 0,
          width: '100vw',
          height: '100vh',
          cursor: 'pointer',
        }}>
        <div
          data-testid='add-product-modal'
          style={{
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: '300px',
            maxWidth: '500px',
          }}
          role='dialog'
          aria-labelledby='modal-title'
          aria-modal='true'
          onClick={handleModalContentClick}>
          <h2 id='modal-title' style={{ marginTop: 0 }}>
            {title}
          </h2>
          <form onSubmit={handleInternalFormSubmit} id='create-product-form'>
            <p>Actual form fields will go here.</p>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                type='button'
                onClick={onClose}
                style={{ marginRight: '10px' }}>
                Cancel
              </button>
              <button type='submit'>Create Product</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
