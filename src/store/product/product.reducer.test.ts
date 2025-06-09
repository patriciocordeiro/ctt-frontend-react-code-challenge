import { Product } from '../../models/product.model';
import * as actions from './product.actions';
import { initialState, productReducer } from './product.reducer';
import {
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  ProductAction,
  ProductState,
} from './product.types';

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

  describe('productReducer - Create Product', () => {
    const existingProduct: Product = {
      id: '1',
      description: 'Existing',
      stock: 1,
      price: 10,
      categories: [],
    };
    const newProductFromServer: Product = {
      id: '2',
      description: 'New Product',
      stock: 5,
      price: 25,
      categories: ['new'],
    };

    const stateWithExistingItem: ProductState = {
      ...initialState,
      items: [existingProduct],
    };

    it('should handle CREATE_PRODUCT_REQUEST', () => {
      const expectedState: ProductState = {
        ...stateWithExistingItem,
        saveLoading: true,
        error: null,
      };
      expect(
        productReducer(stateWithExistingItem, { type: CREATE_PRODUCT_REQUEST })
      ).toEqual(expectedState);
    });

    it('should handle CREATE_PRODUCT_SUCCESS', () => {
      const prevState: ProductState = {
        ...stateWithExistingItem,
        saveLoading: true,
        error: 'some previous error',
      };
      const expectedState: ProductState = {
        ...stateWithExistingItem,
        saveLoading: false,
        items: [...stateWithExistingItem.items, newProductFromServer],
        error: null,
      };
      expect(
        productReducer(prevState, {
          type: CREATE_PRODUCT_SUCCESS,
          payload: newProductFromServer,
        })
      ).toEqual(expectedState);
    });

    it('should handle CREATE_PRODUCT_FAILURE', () => {
      const errorMessage = 'Failed to create product';
      const prevState: ProductState = {
        ...stateWithExistingItem,
        saveLoading: true,
      };
      const expectedState: ProductState = {
        ...prevState,
        saveLoading: false,
        error: errorMessage,
      };
      expect(
        productReducer(prevState, {
          type: CREATE_PRODUCT_FAILURE,
          payload: errorMessage,
        })
      ).toEqual(expectedState);
    });
  });
});
