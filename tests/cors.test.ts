import CORS from '../src/cors';

describe('cors.ts -> transformResponse()', () => {
  test('Access-Control-Max-Age', () => {
    const request = new Request(
      'https://httpbin.org/post',
      {
        headers: new Headers({
          origin: 'https://httpbin.org',
        }),
        method: 'GET',
      },
    );
    const response = new Response(
      'Test response body',
      {
        headers: new Headers(),
        status: 200,
      },
    );

    const corsInvalidMaxAge = new CORS({
      origin: true,
      maxAge: 86400.5,
    });
    const invalidMaxAge = corsInvalidMaxAge.transformResponse(request, response);
    expect(invalidMaxAge.headers.has('Access-Control-Max-Age')).toBeFalsy();

    const corsMaxAge = new CORS({
      origin: true,
      maxAge: 86400,
    });
    const maxAge = corsMaxAge.transformResponse(request, response);
    expect(maxAge.headers.get('Access-Control-Max-Age')).toEqual('86400');
  });

  test('Access-Control-Allow-Credentials', () => {
    const request = new Request(
      'https://httpbin.org/post',
      {
        headers: new Headers({
          origin: 'https://httpbin.org',
        }),
        method: 'GET',
      },
    );
    const response = new Response(
      'Test response body',
      {
        headers: new Headers(),
        status: 200,
      },
    );

    const corsNoCredentials = new CORS({
      origin: true,
      credentials: false,
    });
    const noCredentials = corsNoCredentials.transformResponse(request, response);
    expect(noCredentials.headers.has('Access-Control-Allow-Credentials')).toBeFalsy();

    const corsCredentials = new CORS({
      origin: true,
      credentials: true,
    });
    const credentials = corsCredentials.transformResponse(request, response);
    expect(credentials.headers.get('Access-Control-Allow-Credentials')).toEqual('true');
  });

  test('Access-Control-Allow-Methods', () => {
    const request = new Request(
      'https://httpbin.org/post',
      {
        headers: new Headers({
          origin: 'https://httpbin.org',
          'Access-Control-Request-Method': 'GET',
        }),
        method: 'GET',
      },
    );
    const response = new Response(
      'Test response body',
      {
        headers: new Headers(),
        status: 200,
      },
    );

    const corsMethodUndefined = new CORS({
      origin: true,
    });
    const methodUndefined = corsMethodUndefined.transformResponse(request, response);
    expect(methodUndefined.headers.get('Access-Control-Allow-Methods')).toEqual('GET');

    const corsMethodList = new CORS({
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
    });
    const methodList = corsMethodList.transformResponse(request, response);
    expect(methodList.headers.get('Access-Control-Allow-Methods')).toEqual('GET,POST,OPTIONS');
  });

  test('Access-Control-Allow-Origin', () => {
    const request = new Request(
      'https://httpbin.org/post',
      {
        headers: new Headers({
          origin: 'https://httpbin.org',
          'Access-Control-Request-Method': 'GET',
        }),
        method: 'GET',
      },
    );
    const response = new Response(
      'Test response body',
      {
        headers: new Headers(),
        status: 200,
      },
    );

    const corsOriginTrue = new CORS({
      origin: true,
    });
    const originTrue = corsOriginTrue.transformResponse(request, response);
    expect(originTrue.headers.get('Access-Control-Allow-Origin')).toEqual('https://httpbin.org');

    const corsOriginFalse = new CORS({
      origin: false,
    });
    const originFalse = corsOriginFalse.transformResponse(request, response);
    expect(originFalse.headers.has('Access-Control-Allow-Origin')).toBeFalsy();

    const corsOriginArray = new CORS({
      origin: ['https://httpbin.org', 'http://example.com'],
    });
    const originArray = corsOriginArray.transformResponse(request, response);
    expect(originArray.headers.get('Access-Control-Allow-Origin')).toEqual('https://httpbin.org');

    const corsOriginWildcard = new CORS({
      origin: '*',
    });
    const originWildcard = corsOriginWildcard.transformResponse(request, response);
    expect(originWildcard.headers.get('Access-Control-Allow-Origin')).toEqual('*');
  });
});
