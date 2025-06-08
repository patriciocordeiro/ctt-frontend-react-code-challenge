import { render, screen, within } from '@testing-library/react';
import { Product } from '../../models/product.model';
import { ProductList } from './ProductList';

const mockProducts: Product[] = [
  {
    id: '1',
    description: 'Product A Description',
    stock: 10,
    price: 100.5,
    categories: ['cat1'],
  },
  {
    id: '2',
    description: 'Product B Special',
    stock: 5,
    price: 25.75,
    categories: ['cat2'],
  },
  {
    id: '3',
    description: 'Another Item C',
    stock: 0,
    price: 9.99,
    categories: ['cat1', 'cat3'],
  },
];

describe('ProductList', () => {
  it('should render the product list component', () => {
    render(<ProductList />);
    expect(screen.getByTestId('product-list-component')).toBeInTheDocument();
    expect(screen.getByText(/Product List/i)).toBeInTheDocument();
  });

  test('should display "No products available" when no products are provided', () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText(/No products available/i)).toBeInTheDocument();
  });
});

describe('when products are provided', () => {
  beforeEach(() => {
    render(<ProductList products={mockProducts} />);
  });

  test('should render a table', () => {
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('should render correct table headers', () => {
    expect(
      screen.getByRole('columnheader', { name: /ID/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Description/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Stock/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Categories/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /Price/i })
    ).toBeInTheDocument();
  });

  test('should render the correct number of product rows', () => {
    const table = screen.getByRole('table');
    const tbody =
      within(table).getAllByRole('rowgroup')[1] ||
      within(table).getByRole('rowgroup', { name: '' });
    expect(within(tbody).getAllByRole('row')).toHaveLength(mockProducts.length);
  });

  test('should display product data in each row', () => {
    mockProducts.forEach((product) => {
      const descriptionCell = screen.getByText(product.description);
      const productRow = descriptionCell.closest('tr');
      expect(productRow).not.toBeNull();
      if (productRow) {
        const cells = within(productRow).getAllByRole('cell');
        expect(cells[0]).toHaveTextContent(product.id);
        expect(cells[1]).toHaveTextContent(product.description);
        expect(cells[2]).toHaveTextContent(product.stock.toString());
        expect(cells[3]).toHaveTextContent(product.categories.join(', '));
        const expectedEuro = product.price.toLocaleString('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        });
        const normalize = (s: string) => s.replace(/\s/g, '');
        expect(normalize(cells[4].textContent || '')).toBe(
          normalize(expectedEuro)
        );
      }
    });
  });

  test('should not display "No products available" message', () => {
    expect(
      screen.queryByText(/No products available/i)
    ).not.toBeInTheDocument();
  });
});
