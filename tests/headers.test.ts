import {
  setForwardedHeaders,
  setRequestHeaders,
  setResponseHeaders,
} from '../src/headers';

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

  setForwardedHeaders(request);
  expect(request.headers.get('X-Forwarded-Proto')).toEqual('https');
  expect(request.headers.get('X-Forwarded-Host')).toEqual('https://httpbin.org');
  expect(request.headers.get('X-Forwarded-For')).toEqual('127.0.0.1, 127.0.0.2, 1.1.1.1');
});

test('headers.ts -> setRequestHeaders()', () => {
  const request = new Request(
    'https://httpbin.org/get',
    {
      headers: new Headers({
        'cf-connecting-ip': '1.1.1.1',
      }),
      method: 'GET',
    },
  );

  setRequestHeaders(request, {
    request: {
      'X-Test': 'Test header',
      'X-Forwarded-For': 'Test override',
    },
  });

  expect(request.headers.get('X-Test')).toEqual('Test header');
  expect(request.headers.get('X-Forwarded-For')).toEqual('Test override');
});

test('headers.ts -> setResponseHeaders()', () => {
  const response = new Response(
    'https://httpbin.org/get',
    {
      headers: new Headers({
        'X-Powered-By': 'Express',
      }),
    },
  );

  const headersResponse = setResponseHeaders(
    response,
    {
      response: {
        'X-Test': 'Test header',
      },
    },
    {
      noSniff: true,
      xssFilter: true,
      hidePoweredBy: true,
      ieNoOpen: true,
    },
  );

  expect(headersResponse.headers.has('X-Powered-By')).toEqual(false);
  expect(headersResponse.headers.get('X-Test')).toEqual('Test header');
  expect(headersResponse.headers.get('X-XSS-Protectio')).toEqual('0');
  expect(headersResponse.headers.get('X-Content-Type-Options')).toEqual('nosniff');
  expect(headersResponse.headers.get('X-Download-Options')).toEqual('noopen');
});
