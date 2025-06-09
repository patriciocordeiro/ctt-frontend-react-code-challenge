/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import { NewProductData } from '../../store/product/product.types';
import './ProductModal.css';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: NewProductData, id: string) => void;
  title: string;
  saveLoading?: boolean;
  initialData?: Partial<NewProductData>;
  editingId?: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  saveLoading = false,
  initialData = {},
  editingId,
}) => {
  const [description, setDescription] = useState(initialData.description || '');
  const [stock, setStock] = useState(initialData.stock?.toString() || '');
  const [price, setPrice] = useState(initialData.price?.toString() || '');
  const [categories, setCategories] = useState(
    initialData.categories?.join(', ') || ''
  );

  useEffect(() => {
    if (!isOpen) {
      setDescription('');
      setStock('');
      setPrice('');
      setCategories('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInternalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    onSubmit(formData, editingId || '');
  };

  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <div
        data-testid='modal-overlay'
        onClick={saveLoading ? undefined : onClose}
        className='product-modal-overlay'>
        <div
          data-testid='product-modal-content'
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
            id='product-form'
            noValidate>
            <fieldset
              disabled={saveLoading}
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
            <div className='product-modal-form-actions'>
              <button type='button' onClick={onClose} disabled={saveLoading}>
                Cancel
              </button>
              <button type='submit' disabled={saveLoading}>
                {saveLoading
                  ? 'Saving...'
                  : editingId
                  ? 'Save Changes'
                  : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
