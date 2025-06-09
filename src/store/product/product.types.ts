import { Product } from '../../models/product.model';

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const UPDATE_PRODUCT_REQUEST = 'UPDATE_PRODUCT_REQUEST';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'UPDATE_PRODUCT_FAILURE';

export const DELETE_PRODUCT_REQUEST = 'DELETE_PRODUCT_REQUEST';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

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

export type NewProductData = Omit<Product, 'id'>;

export interface CreateProductRequestAction {
  type: typeof CREATE_PRODUCT_REQUEST;
}
export interface CreateProductSuccessAction {
  type: typeof CREATE_PRODUCT_SUCCESS;
  payload: Product;
}
export interface CreateProductFailureAction {
  type: typeof CREATE_PRODUCT_FAILURE;
  payload: string;
}

export interface UpdateProductRequestAction {
  type: typeof UPDATE_PRODUCT_REQUEST;
}

export interface UpdateProductSuccessAction {
  type: typeof UPDATE_PRODUCT_SUCCESS;
  payload: Product;
}

export interface UpdateProductFailureAction {
  type: typeof UPDATE_PRODUCT_FAILURE;
  payload: string;
}

export interface DeleteProductRequestAction {
  type: typeof DELETE_PRODUCT_REQUEST;
  meta: { id: string };
}
export interface DeleteProductSuccessAction {
  type: typeof DELETE_PRODUCT_SUCCESS;
  payload: { id: string };
}
export interface DeleteProductFailureAction {
  type: typeof DELETE_PRODUCT_FAILURE;
  payload: string;
  meta: { id: string };
}

export type ProductAction =
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction
  | CreateProductRequestAction
  | CreateProductSuccessAction
  | CreateProductFailureAction
  | UpdateProductRequestAction
  | UpdateProductSuccessAction
  | UpdateProductFailureAction
  | DeleteProductRequestAction
  | DeleteProductSuccessAction
  | DeleteProductFailureAction;

export interface ProductState {
  readonly items: Product[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly saveLoading?: boolean;
}
