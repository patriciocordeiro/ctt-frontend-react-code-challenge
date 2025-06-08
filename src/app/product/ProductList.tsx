import React from 'react';
import { Product } from '../../models/product.model';

interface ProductListProps {
  products?: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div data-testid='product-list-component'>
      <h2>Product List</h2>
      {products && products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table className='product-table'>
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
            {products?.map((item) => (
              <tr key={item.id}>
                <td data-label='ID'>{item.id}</td>
                <td data-label='Description'>{item.description}</td>
                <td data-label='Stock'>{item.stock}</td>
                <td data-label='Categories'>{item.categories.join(', ')}</td>
                <td data-label='Price'>
                  {item.price.toLocaleString('pt-PT', {
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

export default ProductList;
