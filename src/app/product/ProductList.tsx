import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/product/product.actions';
import { NewProductData } from '../../store/product/product.types';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store';
import { ProductModal } from './ProductModal';

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

  const handleCreateProduct = (formData?: NewProductData) => {
    if (!formData) return;
    handleCloseModal();
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateProduct}
        title='Create New Product'
      />

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
