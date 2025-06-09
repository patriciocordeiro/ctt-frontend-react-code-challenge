import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/product/product.actions';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store';

export const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div data-testid='product-list-component'>
        <h2>Product List</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid='product-list-component'>
        <h2>Product List</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div data-testid='product-list-component'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
        <h2>Product List</h2>
        <button onClick={handleOpenModal}>Add Product</button>{' '}
      </div>

      {/* Modal placeholder (this will be extracted to ProductModal.tsx) */}
      {isModalOpen && (
        <div
          data-testid='add-product-modal'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid #ccc',
            padding: '20px',
            background: 'white',
            zIndex: 1000,
          }}
          role='dialog'
          aria-labelledby='modal-title'>
          <h2 id='modal-title'>Add New Product</h2>
          <p>Product form will go here...</p>
          {/* Product form */}
          <button onClick={handleCloseModal}>Cancel</button>{' '}
        </div>
      )}
      {/* Overlay for modal */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              handleCloseModal();
            }
          }}
          tabIndex={0}
          role='button'
          aria-label='Close modal overlay'
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Categories</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.description}</td>
                <td>{product.stock}</td>
                <td>{product.categories.join(', ')}</td>
                <td>
                  {product.price.toLocaleString('pt-PT', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
