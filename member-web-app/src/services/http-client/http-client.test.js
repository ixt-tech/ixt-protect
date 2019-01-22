import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import HttpClient from './http-client';

const API = 'http://localhost:3001/api';
const mockServer = new MockAdapter(axios);

describe('HttpClient', () => {
    let httpClientInstance;

    const API_PRODUCTS_URL = `${API}/products`;
    const API_PRODUCT_URL = `${API}/products/1`;

    const PRODUCTS_URL = '/products';
    const PRODUCT_URL = '/products/1';

    const baseParams = {title: 'product1'};

    beforeEach(() => (httpClientInstance = new HttpClient(API)));
    afterEach(() => (httpClientInstance = null));

    it('should create a new instance', () => {
        // expected:
        expect(httpClientInstance).toBeDefined();
    });

    describe('get method', () => {
        it('should make a successful GET request', async () => {
            // given:
            const payload = {
                ...baseParams,
                id: 1,
            };
            // when:
            mockServer.onGet(API_PRODUCT_URL).reply(200, payload);
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.get(PRODUCT_URL).subscribe(resp => resolve(resp));
            });
            // then:
            await expect(promise).resolves.toEqual(payload);
        });

        it('should throw an error on a failed GET request', async () => {
            // when:
            mockServer.onGet(API_PRODUCT_URL).networkError();
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.get(PRODUCT_URL).subscribe(resp => resolve(resp), error => reject(error));
            });
            // then:
            await expect(promise).rejects.toBeInstanceOf(Error);
        });
    });

    describe('post method', () => {
        it('should make a successful POST request', async () => {
            // given:
            const body = {
                title: 'product1',
            };
            // when:
            mockServer.onPost(API_PRODUCTS_URL).reply(201);
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.post(PRODUCTS_URL, body).subscribe(() => resolve(true));
            });
            // then:
            await expect(promise).resolves.toBeDefined();
        });

        it('should throw an error on a failed POST request', async () => {
            // when:
            mockServer.onPost(API_PRODUCTS_URL).networkError();
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.post(PRODUCTS_URL, {}).subscribe(resp => resolve(resp), error => reject(error));
            });
            // then:
            await expect(promise).rejects.toBeInstanceOf(Error);
        });
    });

    describe('put method', () => {
        it('should make a successful PUT request', async () => {
            // when:
            mockServer.onPut(API_PRODUCT_URL, baseParams).reply(204);
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.put(PRODUCT_URL, baseParams).subscribe(() => resolve(true));
            });
            // then:
            await expect(promise).resolves.toBeDefined();
        });

        it('should throw an error on a failed PUT request', async () => {
            // when:
            mockServer.onPut(API_PRODUCT_URL, baseParams).networkError();
            const promise = new Promise((resolve, reject) => {
                httpClientInstance
                    .put(PRODUCT_URL, baseParams)
                    .subscribe(resp => resolve(resp), error => reject(error));
            });
            // then:
            await expect(promise).rejects.toBeInstanceOf(Error);
        });
    });

    describe('patch method', () => {
        it('should make a successful PATCH request', async () => {
            // when:
            mockServer.onPatch(API_PRODUCT_URL, baseParams).reply(204);
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.patch(PRODUCT_URL, baseParams).subscribe(() => resolve(true));
            });
            // then:
            await expect(promise).resolves.toBeDefined();
        });

        it('should throw an error on a failed PATCH request', async () => {
            // when:
            mockServer.onPatch(API_PRODUCT_URL, baseParams).networkError();
            const promise = new Promise((resolve, reject) => {
                httpClientInstance
                    .patch(PRODUCT_URL, baseParams)
                    .subscribe(resp => resolve(resp), error => reject(error));
            });
            // then:
            await expect(promise).rejects.toBeInstanceOf(Error);
        });
    });

    describe('delete method', () => {
        it('should make a successful DELETE request', async () => {
            // when:
            mockServer.onDelete(API_PRODUCT_URL).reply(200);
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.delete(PRODUCT_URL).subscribe(resp => resolve(true));
            });
            // then:
            await expect(promise).resolves.toBeDefined();
        });

        it('should throw an error on a failed DELETE request', async () => {
            // when:
            mockServer.onDelete(API_PRODUCT_URL).networkError();
            const promise = new Promise((resolve, reject) => {
                httpClientInstance.delete(PRODUCT_URL).subscribe(resp => resolve(resp), error => reject(error));
            });
            // then:
            await expect(promise).rejects.toBeInstanceOf(Error);
        });
    });
});
