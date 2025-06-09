// mock the environment variable for API URL
process.env.REACT_APP_API_URL = 'http://localhost/api';

import '@testing-library/jest-dom';

import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
