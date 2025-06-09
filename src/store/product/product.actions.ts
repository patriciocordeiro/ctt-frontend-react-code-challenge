import { AxiosError } from 'axios';
import { ProductApiEndpoint } from '../../models/product-api-endpoint.enum';
import { Product } from '../../models/product.model';
import httpService from '../../services/http-service';
import { AppDispatch } from '../store';
import {
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  NewProductData,
  ProductAction,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
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

export const createProductRequest = (): ProductAction => ({
  type: CREATE_PRODUCT_REQUEST,
});

export const createProductSuccess = (product: Product): ProductAction => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: product,
});

export const createProductFailure = (error: string): ProductAction => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: error,
});

export const updateProductRequest = (): ProductAction => ({
  type: UPDATE_PRODUCT_REQUEST,
});
export const updateProductSuccess = (product: Product): ProductAction => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: product,
});
export const updateProductFailure = (error: string): ProductAction => ({
  type: UPDATE_PRODUCT_FAILURE,
  payload: error,
});

export const deleteProductRequest = (id: string): ProductAction => ({
  type: DELETE_PRODUCT_REQUEST,
  meta: { id },
});
export const deleteProductSuccess = (id: string): ProductAction => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: { id },
});
export const deleteProductFailure = (
  id: string,
  error: string
): ProductAction => ({
  type: DELETE_PRODUCT_FAILURE,
  payload: error,
  meta: { id },
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

export const createProduct =
  (newProduct: NewProductData) => async (dispatch: AppDispatch) => {
    dispatch(createProductRequest());
    try {
      const response = await httpService.post<Product>(
        ProductApiEndpoint.Products,
        newProduct
      );
      dispatch(createProductSuccess(response.data));
    } catch (error) {
      dispatch(createProductFailure((error as AxiosError).message));
    }
  };

export const updateProduct =
  (productId: string, productData: NewProductData) =>
  async (dispatch: AppDispatch) => {
    dispatch(updateProductRequest());
    try {
      const response = await httpService.put<Product>(
        `${ProductApiEndpoint.Products}/${productId}`,
        productData
      );
      dispatch(updateProductSuccess(response.data));
    } catch (error) {
      dispatch(updateProductFailure((error as AxiosError).message));
    }
  };

export const deleteProduct =
  (productId: string) => async (dispatch: AppDispatch) => {
    dispatch(deleteProductRequest(productId));
    try {
      await httpService.delete(`${ProductApiEndpoint.Products}/${productId}`);
      dispatch(deleteProductSuccess(productId));
    } catch (error) {
      dispatch(deleteProductFailure(productId, (error as AxiosError).message));
    }
  };
