import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * The base URL for API requests, sourced from the environment variable `REACT_APP_API_URL`.
 * This value should be set in the environment configuration to point to the backend server.
 */
const baseURL = process.env.REACT_APP_API_URL;
if (!baseURL) {
  throw new Error(
    'REACT_APP_API_URL is not defined in environment variables. Check Webpack DefinePlugin and .env setup.'
  );
}

/**
 * An Axios instance pre-configured with a base URL, a 2-second timeout, and JSON content headers.
 * Use this client to make HTTP requests to the application's backend API.
 *
 * @remarks
 * - The `baseURL` is set to the value of the `baseURL` variable.
 * - Requests will timeout after 2000 milliseconds.
 * - All requests use `'Content-Type': 'application/json'` by default.
 *
 * @see {@link https://axios-http.com/docs/instance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Wraps a promise to simulate a network delay before resolving or rejecting.
 *
 * @template T The type of the resolved value of the promise.
 * @param params An object containing:
 *   - promise: The promise to wrap.
 *   - ms (optional): The delay in milliseconds before the promise settles. Defaults to 1000ms.
 * @returns A new promise that resolves or rejects with the same value or error as the original promise, after the specified delay.
 * @remarks
 * This function is intended for development and testing purposes to simulate network latency.
 * A warning is logged to the console when used.
 */
function withDelay<T>({
  promise,
  ms = 1000,
}: {
  promise: Promise<T>;
  ms?: number;
}): Promise<T> {
  console.warn(`Simulating ${ms}ms network delay. Remove for production.`);
  return new Promise((resolve, reject) => {
    promise.then(
      (result) => setTimeout(() => resolve(result), ms),
      (error) => setTimeout(() => reject(error), ms)
    );
  });
}

/**
 * Provides HTTP methods (`get`, `post`, `put`, `delete`) for making API requests using Axios,
 * with an artificial delay applied to each request via the `withDelay` utility.
 *
 * @template T The expected response data type.
 * @property get Sends a GET request to the specified URL.
 * @property post Sends a POST request to the specified URL with optional data.
 * @property put Sends a PUT request to the specified URL with optional data.
 * @property delete Sends a DELETE request to the specified URL.
 *
 * @remarks
 * Each method returns a `Promise` that resolves to an `AxiosResponse<T>`.
 * The `config` parameter allows for additional Axios request configuration.
 */
const httpService = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return withDelay({ promise: apiClient.get<T>(url, config) });
  },
  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return withDelay({ promise: apiClient.post<T>(url, data, config) });
  },
  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return withDelay({ promise: apiClient.put<T>(url, data, config) });
  },
  delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return withDelay({ promise: apiClient.delete<T>(url, config) });
  },
};

export default httpService;
