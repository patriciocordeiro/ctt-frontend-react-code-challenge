import { Product } from '../../models/product.model';
import * as actions from './product.actions';
import { productReducer, initialState } from './product.reducer';
import { ProductAction, ProductState } from './product.types';

describe('productReducer', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      description: 'Product A',
      stock: 10,
      price: 100,
      categories: ['cat1'],
    },
    {
      id: '2',
      description: 'Product B',
      stock: 5,
      price: 200,
      categories: ['cat2'],
    },
  ];

  it('should return the initial state if no action matches or state is undefined', () => {
    const unknownAction = {
      type: 'UNKNOWN_ACTION',
    } as unknown as ProductAction;
    expect(productReducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle FETCH_PRODUCTS_REQUEST', () => {
    const expectedState: ProductState = {
      ...initialState,
      loading: true,
      error: null,
    };
    expect(
      productReducer(initialState, actions.fetchProductsRequest())
    ).toEqual(expectedState);
  });

  it('should handle FETCH_PRODUCTS_SUCCESS', () => {
    const previousState: ProductState = {
      ...initialState,
      loading: true,
      error: 'Some old error',
    };
    const expectedState: ProductState = {
      ...initialState,
      loading: false,
      items: mockProducts,
      error: null,
    };
    expect(
      productReducer(previousState, actions.fetchProductsSuccess(mockProducts))
    ).toEqual(expectedState);
  });

  it('should handle FETCH_PRODUCTS_FAILURE', () => {
    const errorMessage = 'Failed to fetch products';
    const previousState: ProductState = {
      ...initialState,
      loading: true,
      items: mockProducts,
    };
    const expectedState: ProductState = {
      ...initialState,
      loading: false,
      error: errorMessage,
      items: [],
    };
    expect(
      productReducer(previousState, actions.fetchProductsFailure(errorMessage))
    ).toEqual(expectedState);
  });
});
