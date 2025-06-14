import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../models/product.model';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../../store/product/product.actions';
import { NewProductData } from '../../store/product/product.types';
import { RootState } from '../../store/rootReducer';
import { AppDispatch } from '../../store/store';
import ConfirmationModal from './ConfirmationModal';
import './ProductList.css';
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prevSaveLoading, setPrevSaveLoading] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProduct(null);
  }, []);

  useEffect(() => {
    if (prevSaveLoading && !saveLoading && !listError) {
      handleCloseModal();
    }
    setPrevSaveLoading(saveLoading ?? false);
  }, [saveLoading, listError, prevSaveLoading, handleCloseModal]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmitProductForm = (formData: NewProductData, id?: string) => {
    if (id && editingProduct) {
      dispatch(updateProduct(id, formData));
    } else {
      dispatch(createProduct(formData));
    }
  };

  const handleOpenDeleteConfirmModal = (product: Product) => {
    setProductToDelete(product);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseDeleteConfirmModal = () => {
    setProductToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete.id));
      handleCloseDeleteConfirmModal();
    }
  };

  if (listLoading && !isModalOpen) {
    return (
      <div
        data-testid='product-list-component'
        className='product-list-container'>
        <h2 className='product-list-title'>Product List</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (listError && !saveLoading && !isModalOpen) {
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
        <button onClick={handleOpenCreateModal} className='add-product-button'>
          Add Product
        </button>
      </div>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitProductForm}
          title={editingProduct ? 'Edit Product' : 'Create New Product'}
          saveLoading={saveLoading}
          initialData={editingProduct || undefined}
          editingId={editingProduct?.id}
        />
      )}

      {productToDelete && isConfirmDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmDeleteModalOpen}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={() => {
            handleConfirmDelete();
          }}
          title='Confirm Deletion'>
          {`Are you sure you want to delete "${productToDelete.description}"?`}
        </ConfirmationModal>
      )}

      {products.length === 0 && !listLoading ? (
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
              <th>Actions</th>
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
                <td>
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className='edit-button'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenDeleteConfirmModal(product)}
                    className='delete-button'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
