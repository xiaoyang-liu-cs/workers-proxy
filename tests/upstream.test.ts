import {
  cloneRequest,
} from '../src/upstream';

test('upstream.ts -> cloneRequest()', () => {
  const request = new Request(
    'https://httpbin.org/get',
    {
      headers: new Headers({
        host: 'https://httpbin.org',
      }),
      method: 'GET',
    },
  );

  const clonedRequest = cloneRequest(
    'https://example.com/',
    request,
  );

  expect(clonedRequest.url).toEqual('https://example.com/');
  expect(clonedRequest.method).toEqual('GET');
  expect(clonedRequest.headers.get('host')).toEqual('https://httpbin.org');
});
