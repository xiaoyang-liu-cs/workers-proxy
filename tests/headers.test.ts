import { setForwardedHeaders } from '../src/headers';

test('headers.ts -> setForwardedHeaders()', () => {
  const request = new Request(
    'https://httpbin.org/get',
    {
      headers: new Headers({
        host: 'https://httpbin.org',
        'cf-connecting-ip': '1.1.1.1',
        'X-Forwarded-For': '127.0.0.1, 127.0.0.2',
      }),
      method: 'GET',
    },
  );
  const modifiedRequest = setForwardedHeaders(request);
  expect(modifiedRequest.headers.get('X-Forwarded-Proto')).toEqual('https');
  expect(modifiedRequest.headers.get('X-Forwarded-Host')).toEqual('https://httpbin.org');
  expect(modifiedRequest.headers.get('X-Forwarded-For')).toEqual('127.0.0.1, 127.0.0.2, 1.1.1.1');
});
