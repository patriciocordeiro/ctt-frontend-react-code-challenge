/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { NewProductData } from '../../store/product/product.types';
import './ProductModal.css';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: NewProductData) => Promise<unknown>;
  title: string;
  saveLoading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  saveLoading = false,
}) => {
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(saveLoading);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    setIsSubmitting(saveLoading);
  }, [saveLoading]);

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setStock('');
      setPrice('');
      setCategories('');
      setIsSubmitting(false);
      setSubmissionError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInternalFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!description || !stock || !price) {
      window.alert(
        'Please fill in all required fields (Description, Stock, Price).'
      );
      return;
    }
    const stockNum = parseInt(stock, 10);
    const priceNum = parseFloat(price);
    if (isNaN(stockNum) || stockNum < 0) {
      window.alert('Stock must be a non-negative number.');
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      window.alert('Price must be a non-negative number.');
      return;
    }

    const formData: NewProductData = {
      description,
      stock: stockNum,
      price: priceNum,
      categories: categories
        .split(',')
        .map((cat) => cat.trim())
        .filter((cat) => cat),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmissionError(
        (error as { message: string }).message ||
          'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <div
        data-testid='modal-overlay'
        onClick={isSubmitting ? undefined : onClose}
        className='product-modal-overlay'>
        <div
          data-testid='add-product-modal'
          role='dialog'
          aria-labelledby='modal-title'
          aria-modal='true'
          onClick={handleModalContentClick}
          className='product-modal'>
          <h2 id='modal-title' className='product-modal-header'>
            {title}
          </h2>

          <form
            onSubmit={handleInternalFormSubmit}
            id='create-product-form'
            noValidate>
            <fieldset
              disabled={isSubmitting}
              style={{ border: 'none', padding: 0, margin: 0 }}>
              <div className='product-modal-form-input-group'>
                <label
                  htmlFor='product-description'
                  className='product-modal-form-label'>
                  Description:
                </label>
                <input
                  type='text'
                  id='product-description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className='product-modal-form-input'
                />
              </div>
              <div className='product-modal-form-input-group'>
                <label
                  htmlFor='product-stock'
                  className='product-modal-form-label'>
                  Stock:
                </label>
                <input
                  type='number'
                  id='product-stock'
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  min='0'
                  className='product-modal-form-input'
                />
              </div>
              <div className='product-modal-form-input-group'>
                <label
                  htmlFor='product-price'
                  className='product-modal-form-label'>
                  Price:
                </label>
                <input
                  type='number'
                  id='product-price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min='0'
                  step='0.01'
                  className='product-modal-form-input'
                />
              </div>
              <div className='product-modal-form-input-group'>
                <label
                  htmlFor='product-categories'
                  className='product-modal-form-label'>
                  Categories (comma-separated):
                </label>
                <input
                  type='text'
                  id='product-categories'
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  className='product-modal-form-input'
                />
              </div>
            </fieldset>

            {submissionError && (
              <p role='alert' style={{ color: 'red', marginTop: '10px' }}>
                {submissionError}
              </p>
            )}

            <div className='product-modal-form-actions'>
              <button type='button' onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
