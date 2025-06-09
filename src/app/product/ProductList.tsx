import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  fetchProducts,
} from '../../store/product/product.actions';
import { NewProductData } from '../../store/product/product.types';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store';
import { ProductModal } from './ProductModal';

export const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: products,
    loading: listLoading,
    error: listError,
    saveLoading,
  } = useSelector((state: RootState) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateProduct = async (
    formData: NewProductData
  ): Promise<void> => {
    try {
      await dispatch(createProduct(formData));
    } catch (error) {
      console.error(
        'Create product dispatch failed from ProductList (this error should be displayed in modal):',
        error
      );
      throw error;
    }
  };

  if (listLoading) {
    return (
      <div
        data-testid='product-list-component'
        className='product-list-container'>
        <h2 className='product-list-title'>Product List</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (listError) {
    return (
      <div
        data-testid='product-list-component'
        className='product-list-container'>
        <h2 className='product-list-title'>Product List</h2>
        <p className='product-list-error'>{listError}</p>
      </div>
    );
  }

  return (
    <div
      data-testid='product-list-component'
      className='product-list-container'>
      <div className='product-list-header'>
        <h2 className='product-list-title'>Product List</h2>
        <button onClick={handleOpenModal} className='add-product-button'>
          Add Product
        </button>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateProduct}
        title='Create New Product'
        saveLoading={saveLoading}
      />

      {products.length === 0 ? (
        <p className='no-products-message'>No products available</p>
      ) : (
        <table className='products-table'>
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
