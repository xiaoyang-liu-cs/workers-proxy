import Headers from './polyfill/headers';
import Request from './polyfill/request';
import Response from './polyfill/response';

beforeAll(() => {
  (globalThis as any).Headers = Headers;
  (globalThis as any).Request = Request;
  (globalThis as any).Response = Response;
});

afterAll(() => {
  (globalThis as any).Headers = undefined;
  (globalThis as any).Request = undefined;
  (globalThis as any).Response = undefined;
});
