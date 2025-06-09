import { InternalAxiosRequestConfig } from 'axios';
import { ProductApiEndpoint } from '../../models/product-api-endpoint.enum';
import { Product } from '../../models/product.model';
import httpService from '../../services/http-service';
import { AppDispatch } from '../store';
import * as productActionCreators from './product.actions';
import { NewProductData } from './product.types';

jest.mock('../../services/http-service.ts');

describe('Product Thunks - fetchProducts', () => {
  const mockedHttpService = httpService as jest.Mocked<typeof httpService>;

  beforeEach(() => {
    mockedHttpService.get.mockReset();
  });

  it('should dispatch REQUEST and SUCCESS actions on successful fetch', async () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        description: 'Test Product 1',
        stock: 10,
        price: 9.99,
        categories: ['cat1'],
      },
    ];

    mockedHttpService.get.mockResolvedValueOnce({
      data: mockProducts,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });

    const dispatch = jest.fn() as AppDispatch;

    await productActionCreators.fetchProducts()(dispatch);

    expect(mockedHttpService.get).toHaveBeenCalledWith(
      ProductApiEndpoint.Products
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.fetchProductsRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.fetchProductsSuccess(mockProducts)
    );
  });

  it('should dispatch REQUEST and FAILURE actions on failed fetch', async () => {
    const errorMessage = 'Network Error';
    mockedHttpService.get.mockRejectedValueOnce(new Error(errorMessage));

    const dispatch = jest.fn() as AppDispatch;

    await productActionCreators.fetchProducts()(dispatch);

    expect(mockedHttpService.get).toHaveBeenCalledWith(
      ProductApiEndpoint.Products
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.fetchProductsRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.fetchProductsFailure(errorMessage)
    );
  });
});

describe('Product Thunks - createProduct', () => {
  const mockedHttpService = httpService as jest.Mocked<typeof httpService>;

  const newProductData: NewProductData = {
    description: 'Brand New Gadget',
    stock: 50,
    price: 199.99,
    categories: ['electronics', 'gadgets'],
  };
  const createdProductFromServer: Product = {
    ...newProductData,
    id: 'new-uuid-123',
  };

  it('should dispatch REQUEST and SUCCESS actions on successful product creation', async () => {
    mockedHttpService.post.mockResolvedValueOnce({
      data: createdProductFromServer,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });

    const dispatch = jest.fn() as AppDispatch;

    await productActionCreators.createProduct(newProductData)(dispatch);

    expect(mockedHttpService.post).toHaveBeenCalledTimes(1);
    expect(mockedHttpService.post).toHaveBeenCalledWith(
      ProductApiEndpoint.Products,
      newProductData
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.createProductRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.createProductSuccess(createdProductFromServer)
    );
  });

  it('should dispatch REQUEST and FAILURE actions on failed product creation', async () => {
    const errorMessage = 'Failed to create';
    mockedHttpService.post.mockRejectedValueOnce(new Error(errorMessage));

    const dispatch = jest.fn() as AppDispatch;

    await productActionCreators.createProduct(newProductData)(dispatch);

    expect(mockedHttpService.post).toHaveBeenCalledTimes(2);
    expect(mockedHttpService.post).toHaveBeenCalledWith(
      ProductApiEndpoint.Products,
      newProductData
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.createProductRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.createProductFailure(errorMessage)
    );
  });
});

describe('Product Thunks - updateProduct', () => {
  const mockedHttpService = httpService as jest.Mocked<typeof httpService>;
  const productIdToUpdate = 'existing-id-123';
  const productUpdateData: NewProductData = {
    description: 'Updated Gadget',
    stock: 75,
    price: 249.99,
    categories: ['electronics', 'updated'],
  };
  const updatedProductFromServer: Product = {
    ...productUpdateData,
    id: productIdToUpdate,
  };
  beforeEach(() => {
    mockedHttpService.put.mockReset();
  });

  it('should dispatch REQUEST and SUCCESS actions on successful product update', async () => {
    mockedHttpService.put.mockResolvedValueOnce({
      data: updatedProductFromServer,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });
    const dispatch = jest.fn() as AppDispatch;
    await productActionCreators.updateProduct(
      productIdToUpdate,
      productUpdateData
    )(dispatch);

    expect(mockedHttpService.put).toHaveBeenCalledTimes(1);
    expect(mockedHttpService.put).toHaveBeenCalledWith(
      `${ProductApiEndpoint.Products}/${productIdToUpdate}`,
      productUpdateData
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.updateProductRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.updateProductSuccess(updatedProductFromServer)
    );
  });

  it('should dispatch REQUEST and FAILURE actions on failed product update', async () => {
    const errorMessage = 'Failed to update';
    mockedHttpService.put.mockRejectedValueOnce(new Error(errorMessage));
    const dispatch = jest.fn() as AppDispatch;
    await productActionCreators.updateProduct(
      productIdToUpdate,
      productUpdateData
    )(dispatch);

    expect(mockedHttpService.put).toHaveBeenCalledTimes(1);
    expect(mockedHttpService.put).toHaveBeenCalledWith(
      `${ProductApiEndpoint.Products}/${productIdToUpdate}`,
      productUpdateData
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.updateProductRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.updateProductFailure(errorMessage)
    );
  });
});

describe('Product Thunks - deleteProduct', () => {
  const mockedHttpService = httpService as jest.Mocked<typeof httpService>;
  const productIdToDelete = 'existing-id-456';
  beforeEach(() => {
    mockedHttpService.delete.mockReset();
  });

  it('should dispatch REQUEST and SUCCESS actions on successful product deletion', async () => {
    mockedHttpService.delete.mockResolvedValueOnce({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });
    const dispatch = jest.fn() as AppDispatch;
    await productActionCreators.deleteProduct(productIdToDelete)(dispatch);

    expect(mockedHttpService.delete).toHaveBeenCalledWith(
      `${ProductApiEndpoint.Products}/${productIdToDelete}`
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.deleteProductRequest(productIdToDelete)
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.deleteProductSuccess(productIdToDelete)
    );
  });

  it('should dispatch REQUEST and FAILURE actions on failed product deletion', async () => {
    const errorMessage = 'Failed to delete';
    mockedHttpService.delete.mockRejectedValueOnce(new Error(errorMessage));
    const dispatch = jest.fn() as AppDispatch;
    await productActionCreators.deleteProduct(productIdToDelete)(dispatch);

    expect(mockedHttpService.delete).toHaveBeenCalledWith(
      `${ProductApiEndpoint.Products}/${productIdToDelete}`
    );
    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.deleteProductRequest(productIdToDelete)
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.deleteProductFailure(
        productIdToDelete,
        errorMessage
      )
    );
  });
});

describe('Product Thunks - deleteProduct', () => {
  const mockedHttpService = httpService as jest.Mocked<typeof httpService>;
  const productIdToDelete = 'existing-id-456';
  beforeEach(() => {
    mockedHttpService.delete.mockReset();
  });

  it('should dispatch REQUEST and SUCCESS actions on successful product deletion', async () => {
    mockedHttpService.delete.mockResolvedValueOnce({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });
    const dispatch = jest.fn() as AppDispatch;
    await productActionCreators.deleteProduct(productIdToDelete)(dispatch);

    expect(mockedHttpService.delete).toHaveBeenCalledWith(
      `${ProductApiEndpoint.Products}/${productIdToDelete}`
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.deleteProductRequest(productIdToDelete)
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.deleteProductSuccess(productIdToDelete)
    );
  });

  it('should dispatch REQUEST and FAILURE actions on failed product deletion', async () => {
    const errorMessage = 'Failed to delete';
    mockedHttpService.delete.mockRejectedValueOnce(new Error(errorMessage));
    const dispatch = jest.fn() as AppDispatch;
    await productActionCreators.deleteProduct(productIdToDelete)(dispatch);

    expect(mockedHttpService.delete).toHaveBeenCalledWith(
      `${ProductApiEndpoint.Products}/${productIdToDelete}`
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      productActionCreators.deleteProductRequest(productIdToDelete)
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      productActionCreators.deleteProductFailure(
        productIdToDelete,
        errorMessage
      )
    );
  });
});
