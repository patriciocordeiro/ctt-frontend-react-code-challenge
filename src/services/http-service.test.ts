import axios from 'axios';

jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  return {
    ...actualAxios,
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        response: {
          use: jest.fn(),
        },
      },
    })),
  };
});

import httpService from './http-service';

const mockedInstance =
  (axios.create as jest.Mock).mock.results[0]?.value ||
  (axios.create as jest.Mock).mock.results[0]?.value;

beforeEach(() => {
  jest.clearAllMocks();
  (axios.create as jest.Mock).mockReturnValue(mockedInstance);
});

describe('httpService', () => {
  it('should call get and resolve with data', async () => {
    const data = { foo: 'bar' };
    mockedInstance.get.mockResolvedValue({ data });

    const response = await httpService.get<typeof data>('/test');
    expect(mockedInstance.get).toHaveBeenCalledWith('/test', undefined);
    expect(response.data).toEqual(data);
  });

  it('should call post and resolve with data', async () => {
    const data = { foo: 'bar' };
    mockedInstance.post.mockResolvedValue({ data });

    const response = await httpService.post<typeof data>('/test', data);
    expect(mockedInstance.post).toHaveBeenCalledWith('/test', data, undefined);
    expect(response.data).toEqual(data);
  });

  it('should call put and resolve with data', async () => {
    const data = { foo: 'bar' };
    mockedInstance.put.mockResolvedValue({ data });

    const response = await httpService.put<typeof data>('/test', data);
    expect(mockedInstance.put).toHaveBeenCalledWith('/test', data, undefined);
    expect(response.data).toEqual(data);
  });

  it('should call delete and resolve with data', async () => {
    const data = { foo: 'bar' };
    mockedInstance.delete.mockResolvedValue({ data });

    const response = await httpService.delete<typeof data>('/test');
    expect(mockedInstance.delete).toHaveBeenCalledWith('/test', undefined);
    expect(response.data).toEqual(data);
  });

  it('should reject if get fails', async () => {
    mockedInstance.get.mockRejectedValue(new Error('fail'));
    await expect(httpService.get('/fail')).rejects.toThrow('fail');
  });

  it('should reject if post fails', async () => {
    mockedInstance.post.mockRejectedValue(new Error('fail'));
    await expect(httpService.post('/fail')).rejects.toThrow('fail');
  });

  it('should reject if put fails', async () => {
    mockedInstance.put.mockRejectedValue(new Error('fail'));
    await expect(httpService.put('/fail')).rejects.toThrow('fail');
  });

  it('should reject if delete fails', async () => {
    mockedInstance.delete.mockRejectedValue(new Error('fail'));
    await expect(httpService.delete('/fail')).rejects.toThrow('fail');
  });

  it('should throw if REACT_APP_API_URL is not defined (even with dotenv)', () => {
    const originalApiUrl = process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_API_URL;

    jest.resetModules();
    jest.doMock('dotenv', () => ({
      config: jest.fn(),
    }));

    expect(() => {
      require('./http-service');
    }).toThrow('REACT_APP_API_URL is not defined');

    process.env.REACT_APP_API_URL = originalApiUrl;
    jest.dontMock('dotenv');
    jest.resetModules();
  });
});
