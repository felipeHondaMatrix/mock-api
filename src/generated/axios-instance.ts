import Axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.EPR_FLOW_CONTROL_API_URL ?? 'https://dev-api.internal.matrixenergia.com/epr-flow-control-api';

export const axiosInstance = Axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = process.env.EPR_FLOW_CONTROL_API_TOKEN;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const customAxiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = axiosInstance({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customAxiosInstance;
