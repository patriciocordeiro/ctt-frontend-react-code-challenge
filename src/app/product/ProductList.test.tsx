import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import {
  applyMiddleware,
  legacy_createStore as createStore,
  Store,
} from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';

import { Product } from '../../models/product.model';
import * as productActions from '../../store/product/product.actions';
import { ProductAction } from '../../store/product/product.types';
import rootReducer, { RootState } from '../../store/rootReducer';
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

type MockStore = Store<RootState, ProductAction> & {
  dispatch: ThunkDispatch<RootState, unknown, ProductAction>;
};

const setupStore = (initialState?: Partial<RootState>): MockStore => {
  return createStore(
    rootReducer,
    initialState as never,
    applyMiddleware(thunk)
  ) as MockStore;
};

const renderWithProviders = (
  ui: React.ReactElement,
  initialState?: Partial<RootState>
) => {
  const store = setupStore(initialState);
  jest
    .spyOn(productActions, 'fetchProducts')
    .mockImplementation(() => () => Promise.resolve());

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};

describe('ProductList Component (Connected to Redux)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the product list component and placeholder heading', () => {
    renderWithProviders(<ProductList />);
    expect(screen.getByTestId('product-list-component')).toBeInTheDocument();
    expect(screen.getByText(/Product List/i)).toBeInTheDocument();
  });

  it('should dispatch fetchProducts action on mount', () => {
    renderWithProviders(<ProductList />);
    expect(productActions.fetchProducts).toHaveBeenCalledTimes(1);
  });

  it('displays a loading indicator when products are loading', () => {
    const initialState: Partial<RootState> = {
      products: { items: [], loading: true, error: null },
    };
    renderWithProviders(<ProductList />, initialState);
    expect(screen.getByText(/Loading products.../i)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('displays an error message if fetching products fails', () => {
    const errorMessage = 'Failed to load products';
    const initialState: Partial<RootState> = {
      products: { items: [], loading: false, error: errorMessage },
    };
    renderWithProviders(<ProductList />, initialState);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('displays "No products available" when product list is empty and not loading', () => {
    const initialState: Partial<RootState> = {
      products: { items: [], loading: false, error: null },
    };
    renderWithProviders(<ProductList />, initialState);
    expect(screen.getByText(/No products available/i)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  describe('when products are successfully loaded from Redux', () => {
    const initialStateWithProducts: Partial<RootState> = {
      products: { items: mockProducts, loading: false, error: null },
    };

    beforeEach(() => {
      renderWithProviders(<ProductList />, initialStateWithProducts);
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
      const rows = within(table).getAllByRole('row');
      expect(rows.length).toBe(mockProducts.length + 1);
    });

    test('should display product data in each row', () => {
      mockProducts.forEach((product) => {
        const descriptionCell = screen.getByText(product.description);
        const productRow = descriptionCell.closest('tr');
        expect(productRow).not.toBeNull();
        if (productRow) {
          expect(within(productRow).getByText(product.id)).toBeInTheDocument();
          expect(
            within(productRow).getByText(product.description)
          ).toBeInTheDocument();
          expect(
            within(productRow).getByText(product.stock.toString())
          ).toBeInTheDocument();
          expect(
            within(productRow).getByText(product.categories.join(', '))
          ).toBeInTheDocument();

          const expectedEuro = product.price.toLocaleString('pt-PT', {
            style: 'currency',
            currency: 'EUR',
          });
          const normalize = (s: string | null) =>
            s ? s.replace(/\s/g, '') : '';

          const priceCell = Array.from(
            within(productRow).getAllByRole('cell')
          ).find(
            (cell) =>
              normalize(cell.textContent).includes(
                normalize(product.price.toString())
              ) || normalize(cell.textContent).includes(normalize(expectedEuro))
          );
          expect(priceCell).toBeInTheDocument();
          if (priceCell) {
            expect(normalize(priceCell.textContent)).toBe(
              normalize(expectedEuro)
            );
          }
        }
      });
    });

    test('should not display "No products available" message', () => {
      expect(
        screen.queryByText(/No products available/i)
      ).not.toBeInTheDocument();
    });

    test('should not display loading indicator', () => {
      expect(
        screen.queryByText(/Loading products.../i)
      ).not.toBeInTheDocument();
    });

    test('should not display error message', () => {
      expect(
        screen.queryByText(/Failed to load products/i)
      ).not.toBeInTheDocument();
    });
  });
});
