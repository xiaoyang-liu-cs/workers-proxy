import { getCORSResponse } from '../src/cors';

describe('cors.ts -> transformResponse()', () => {
  test('undefined options', () => {
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
    const undefinedOptions = getCORSResponse(request, response);
    expect(undefinedOptions).toBe(response);
  });

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

    const invalidMaxAge = getCORSResponse(request, response, {
      origin: true,
      maxAge: 86400.5,
    });
    expect(invalidMaxAge.headers.has('Access-Control-Max-Age')).toBeFalsy();

    const maxAge = getCORSResponse(request, response, {
      origin: true,
      maxAge: 86400,
    });
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

    const noCredentials = getCORSResponse(request, response, {
      origin: true,
      credentials: false,
    });
    expect(noCredentials.headers.has('Access-Control-Allow-Credentials')).toBeFalsy();

    const credentials = getCORSResponse(request, response, {
      origin: true,
      credentials: true,
    });
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

    const methodUndefined = getCORSResponse(request, response, {
      origin: true,
    });
    expect(methodUndefined.headers.get('Access-Control-Allow-Methods')).toEqual('GET');

    const methodList = getCORSResponse(request, response, {
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
    });
    expect(methodList.headers.get('Access-Control-Allow-Methods')).toEqual('GET,POST,OPTIONS');

    const methodWildcard = getCORSResponse(request, response, {
      origin: true,
      methods: '*',
    });
    expect(methodWildcard.headers.get('Access-Control-Allow-Methods')).toEqual('*');
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

    const originTrue = getCORSResponse(request, response, {
      origin: true,
    });
    expect(originTrue.headers.get('Access-Control-Allow-Origin')).toEqual('https://httpbin.org');

    const originFalse = getCORSResponse(request, response, {
      origin: false,
    });
    expect(originFalse.headers.has('Access-Control-Allow-Origin')).toBeFalsy();

    const originArray = getCORSResponse(request, response, {
      origin: [
        'https://httpbin.org',
        'http://example.com',
      ],
    });
    expect(originArray.headers.get('Access-Control-Allow-Origin')).toEqual('https://httpbin.org');

    const originWildcard = getCORSResponse(request, response, {
      origin: '*',
    });
    expect(originWildcard.headers.get('Access-Control-Allow-Origin')).toEqual('*');
  });
});
