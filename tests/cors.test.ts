import { useCORS } from '../src/cors';
import { Context } from '../types/middleware';

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
    headers: new Headers({}),
    status: 200,
  },
);

const baseContext: Context = {
  request,
  response,
  hostname: 'https://httpbin.org',
  upstream: null,
  options: {
    upstream: {
      domain: 'httpbin.org',
    },
  },
};

describe('cors.ts -> useCORS()', () => {
  test('undefined options', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response).toBe(response);
  });

  test('Access-Control-Max-Age (Invalid)', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
          maxAge: 86400.5,
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.has('Access-Control-Max-Age')).toBeFalsy();
  });

  test('Access-Control-Max-Age (Valid)', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
          maxAge: 86400,
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Max-Age')).toEqual('86400');
  });

  test('Access-Control-Allow-Credentials: false', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
          credentials: false,
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.has('Access-Control-Allow-Credentials')).toBeFalsy();
  });

  test('Access-Control-Allow-Credentials: true', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
          credentials: true,
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Allow-Credentials')).toEqual('true');
  });

  test('Access-Control-Allow-Methods: undefined', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Allow-Methods')).toEqual('GET');
  });

  test('Access-Control-Allow-Methods: array', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
          methods: ['GET', 'POST', 'OPTIONS'],
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Allow-Methods')).toEqual('GET,POST,OPTIONS');
  });

  test('Access-Control-Allow-Methods: wildcard', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
          methods: '*',
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Allow-Methods')).toEqual('*');
  });

  test('Access-Control-Allow-Origin: true', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: true,
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Allow-Origin')).toEqual('https://httpbin.org');
  });

  test('Access-Control-Allow-Origin: false', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: false,
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.has('Access-Control-Allow-Origin')).toBeFalsy();
  });

  test('Access-Control-Allow-Origin: array', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: [
            'https://httpbin.org',
            'http://example.com',
          ],
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Allow-Origin')).toEqual('https://httpbin.org');
  });

  test('Access-Control-Allow-Origin: wildcard', () => {
    const context: Context = {
      ...baseContext,
      options: {
        upstream: {
          domain: 'httpbin.org',
        },
        cors: {
          origin: '*',
        },
      },
    };
    useCORS(context, () => null);
    expect(context.response.headers.get('Access-Control-Allow-Origin')).toEqual('*');
  });
});
