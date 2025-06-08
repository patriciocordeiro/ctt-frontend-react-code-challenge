import { render, screen } from '@testing-library/react';
import { ProductList } from './ProductList';

describe('ProductList', () => {
  it('should render the product list component', () => {
    render(<ProductList />);
    expect(screen.getByTestId('product-list-component')).toBeInTheDocument();
    expect(screen.getByText(/Product List/i)).toBeInTheDocument();
  });
});
