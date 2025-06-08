import { Product } from '../../models/product.model';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  ProductAction,
} from './product.types';

export const fetchProductsRequest = (): ProductAction => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products: Product[]): ProductAction => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error: string): ProductAction => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});
