import { InternalAxiosRequestConfig } from 'axios';
import { ProductApiEndpoint } from '../../models/product-api-endpoint.enum';
import { Product } from '../../models/product.model';
import httpService from '../../services/http-service';
import { AppDispatch } from '../store';
import * as productActionCreators from './product.actions';

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
