import HttpClient from './http-client';

const httpClient = new HttpClient(
  process.env.REACT_APP_API_URL,
);

export default httpClient;
