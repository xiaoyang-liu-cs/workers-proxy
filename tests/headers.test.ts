import {
  setForwardedHeaders,
  useRequestHeaders,
  useResponseHeaders,
} from '../src/headers';
import { Context } from '../types/middleware';

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
  const context: Context = {
    request: new Request(
      'https://httpbin.org/get',
      {
        headers: new Headers({
          'cf-connecting-ip': '1.1.1.1',
        }),
        method: 'GET',
      },
    ),
    response: new Response(),
    hostname: 'https://httpbin.org',
    upstream: null,
    options: {
      upstream: {
        domain: 'httpbin.org',
      },
      header: {
        request: {
          'X-Test': 'Test header',
          'X-Forwarded-For': 'Test override',
        },
      },
    },
  };
  useRequestHeaders(context, () => null);

  expect(context.request.headers.get('X-Test')).toEqual('Test header');
  expect(context.request.headers.get('X-Forwarded-For')).toEqual('Test override');
});

test('headers.ts -> setResponseHeaders()', () => {
  const context: Context = {
    response: new Response(
      'https://httpbin.org/get',
      {
        headers: new Headers({
          'X-Powered-By': 'Express',
          'X-PJAX-URL': 'https://test.com/pjax',
          'Set-Cookie': 'cookie_1=test; domain=<domain-value>; secure; samesite=strict; cookie_2=test; domain=<domain-value>; secure; httpOnly;',
        }),
      },
    ),
    request: new Request('https://httpbin.org'),
    hostname: 'httpbin.org',
    upstream: null,
    options: {
      upstream: {
        domain: 'httpbin.org',
      },
      header: {
        response: {
          'X-Test': 'Test header',
        },
      },
      security: {
        noSniff: true,
        xssFilter: true,
        hidePoweredBy: true,
        ieNoOpen: true,
        setCookie: true,
        forwarded: true,
      },
    },
  };
  useResponseHeaders(context, () => null);

  expect(context.response.headers.has('X-Powered-By')).toEqual(false);
  expect(context.response.headers.get('X-Test')).toEqual('Test header');
  expect(context.response.headers.get('X-XSS-Protection')).toEqual('0');
  expect(context.response.headers.get('X-Content-Type-Options')).toEqual('nosniff');
  expect(context.response.headers.get('X-Download-Options')).toEqual('noopen');
  expect(context.response.headers.get('X-PJAX-URL')).toEqual('https://httpbin.org/pjax');

  const cookie = 'cookie_1=test;domain=httpbin.org;secure;samesite=strict;cookie_2=test;domain=httpbin.org;secure;httpOnly;';
  expect(context.response.headers.get('Set-Cookie')).toEqual(cookie);
});
