import { AxiosError } from 'axios';
import { ProductApiEndpoint } from '../../models/product-api-endpoint.enum';
import { Product } from '../../models/product.model';
import httpService from '../../services/http-service';
import { AppDispatch } from '../store';
import {
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
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

// Thunk Actions
export const fetchProducts = () => async (dispatch: AppDispatch) => {
  dispatch(fetchProductsRequest());
  try {
    const response = await httpService.get<Product[]>(
      ProductApiEndpoint.Products
    );
    dispatch(fetchProductsSuccess(response.data));
  } catch (error) {
    dispatch(fetchProductsFailure((error as AxiosError).message));
  }
};
