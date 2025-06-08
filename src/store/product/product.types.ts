import { Product } from '../../models/product.model';

export const FETCH_PRODUCTS_REQUEST = 'product/FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'product/FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'product/FETCH_PRODUCTS_FAILURE';

interface FetchProductsRequestAction {
  type: typeof FETCH_PRODUCTS_REQUEST;
}

interface FetchProductsSuccessAction {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  payload: Product[];
}

interface FetchProductsFailureAction {
  type: typeof FETCH_PRODUCTS_FAILURE;
  payload: string;
}

export type ProductAction =
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction;

export interface ProductState {
  readonly items: Product[];
  readonly loading: boolean;
  readonly error: string | null;
}
