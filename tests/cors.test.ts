import CORS from '../src/cors';

describe('cors.ts -> transformResponse()', () => {
  test('Access-Control-Allow-Origin', async () => {
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

    const corsAsteriskOrigin = new CORS(
      {
        origins: '*',
      },
    );
    const asteriskOriginResponse = corsAsteriskOrigin.transformResponse(
      request,
      response,
    );
    expect(
      asteriskOriginResponse.headers.get('Access-Control-Allow-Origin'),
    ).toEqual('*');

    const corsExactOrigin = new CORS(
      {
        origins: [
          'https://httpbin.org',
          'https://example.com',
        ],
      },
    );
    const exactOriginResponse = corsExactOrigin.transformResponse(
      request,
      response,
    );
    expect(
      exactOriginResponse.headers.get('Access-Control-Allow-Origin'),
    ).toEqual('https://httpbin.org');
  });

  test('Access-Control-Allow-Methods', async () => {
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

    const corsAsteriskMethods = new CORS(
      {
        origins: [
          'https://httpbin.org',
          'https://example.com',
        ],
        methods: '*',
      },
    );
    const asteriskMethodsResponse = corsAsteriskMethods.transformResponse(
      request,
      response,
    );
    expect(
      asteriskMethodsResponse.headers.get('Access-Control-Allow-Methods'),
    ).toEqual('*');

    const corsExactMethods = new CORS(
      {
        origins: [
          'https://httpbin.org',
          'https://example.com',
        ],
        methods: [
          'GET',
          'POST',
          'PATCH',
        ],
      },
    );
    const exactMethodsResponse = corsExactMethods.transformResponse(
      request,
      response,
    );
    expect(
      exactMethodsResponse.headers.get('Access-Control-Allow-Methods'),
    ).toEqual('GET,POST,PATCH');
  });

  test('Access-Control-Max-Age', async () => {
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

    const corsMaxAge = new CORS(
      {
        origins: [
          'https://httpbin.org',
          'https://example.com',
        ],
        methods: '*',
        maxAge: 86400,
      },
    );
    const maxAgeResponse = corsMaxAge.transformResponse(
      request,
      response,
    );
    expect(
      maxAgeResponse.headers.get('Access-Control-Max-Age'),
    ).toEqual('86400');
  });
});
