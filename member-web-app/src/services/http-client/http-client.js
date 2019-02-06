import axios from 'axios';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';

const promiseToObservable = promise =>
  from(promise).pipe(map(res => res.data));

class HttpClient {
  constructor(API_HOST) {
    this.axiosClient = axios.create();
    this.axiosClient.interceptors.request.use(
      config => {
        const token = localStorage.getItem(
          'ACCESS_TOKEN',
        );
        if (token) {
          config.headers.common[
            'x-access-token'
            ] = token;
        }

        return config;
      },
    );
    this.API_HOST = API_HOST;
  }

  get(url, params) {
    return promiseToObservable(
      this.axiosClient.get(
        `${this.API_HOST}${url}`,
        {params},
      ),
    );
  }

  post(url, body = {}, params = {}) {
    return promiseToObservable(
      this.axiosClient.post(
        this.API_HOST + url,
        body,
        {params},
      ),
    );
  }

  put(url, body = {}, params = {}) {
    return promiseToObservable(
      this.axiosClient.put(
        this.API_HOST + url,
        body,
        {params},
      ),
    );
  }

  patch(url, body, params) {
    return promiseToObservable(
      this.axiosClient.patch(
        this.API_HOST + url,
        body,
        {params},
      ),
    );
  }

  delete(url, params) {
    return promiseToObservable(
      this.axiosClient.delete(
        this.API_HOST + url,
        {params},
      ),
    );
  }
}

export default HttpClient;
