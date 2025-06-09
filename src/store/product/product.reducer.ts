import {
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  ProductAction,
  ProductState,
} from './product.types';

export const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  saveLoading: false,
};

export const productReducer = (
  state = initialState,
  action: ProductAction
): ProductState => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        items: [],
      };
    case CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        saveLoading: true,
        error: null,
      };
    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        saveLoading: false,
        items: [...state.items, action.payload],
        error: null,
      };
    case CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        saveLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
