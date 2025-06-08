import React from 'react';
import { Product } from '../../models/product.model';

interface ProductListProps {
  products?: Product[];
}
export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div data-testid='product-list-component'>
      <h2>Product List</h2>
      {products && products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.description}</li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default ProductList;
