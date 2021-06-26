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

  setForwardedHeaders(request.headers);
  expect(request.headers.get('X-Forwarded-Proto')).toEqual('https');
  expect(request.headers.get('X-Forwarded-Host')).toEqual('https://httpbin.org');
  expect(request.headers.get('X-Forwarded-For')).toEqual('127.0.0.1, 127.0.0.2');
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

  const headersRequest = setRequestHeaders(request, {
    request: {
      'X-Test': 'Test header',
      'X-Forwarded-For': 'Test override',
    },
  });

  expect(headersRequest.headers.get('X-Test')).toEqual('Test header');
  expect(headersRequest.headers.get('X-Forwarded-For')).toEqual('Test override');
});

test('headers.ts -> setResponseHeaders()', () => {
  const response = new Response(
    'https://httpbin.org/get',
    {
      headers: new Headers({
        'X-Powered-By': 'Express',
        'X-PJAX-URL': 'https://test.com/pjax',
        'Set-Cookie': 'cookie_1=test; domain=<domain-value>; secure; samesite=strict; cookie_2=test; domain=<domain-value>; secure; httpOnly;',
      }),
    },
  );

  const headersResponse = setResponseHeaders(
    response,
    'httpbin.org',
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
      setCookie: true,
    },
  );

  expect(headersResponse.headers.has('X-Powered-By')).toEqual(false);
  expect(headersResponse.headers.get('X-Test')).toEqual('Test header');
  expect(headersResponse.headers.get('X-XSS-Protection')).toEqual('0');
  expect(headersResponse.headers.get('X-Content-Type-Options')).toEqual('nosniff');
  expect(headersResponse.headers.get('X-Download-Options')).toEqual('noopen');
  expect(headersResponse.headers.get('X-PJAX-URL')).toEqual('https://httpbin.org/pjax');

  const cookie = 'cookie_1=test;domain=httpbin.org;secure;samesite=strict;cookie_2=test;domain=httpbin.org;secure;httpOnly;';
  expect(headersResponse.headers.get('Set-Cookie')).toEqual(cookie);
});
