import CORS from '../src/cors';

describe('cors.ts -> transformResponse()', () => {
  test('Access-Control-Allow-Origin', async () => {
    const headers = new Headers({
      origin: 'https://httpbin.org',
    });

    const request = new Request(
      'https://httpbin.org/post',
      {
        headers,
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

    const corsExactOrigin = new CORS(
      {
        origins: [
          'https://httpbin.org',
          'https://example.com',
        ],
      },
    );

    const asteriskOriginResponse = corsAsteriskOrigin.transformResponse(
      request,
      response,
    );

    const exactOriginResponse = corsExactOrigin.transformResponse(
      request,
      response,
    );

    expect(
      asteriskOriginResponse.headers.get('Access-Control-Allow-Origin'),
    ).toEqual('*');

    expect(
      exactOriginResponse.headers.get('Access-Control-Allow-Origin'),
    ).toEqual('https://httpbin.org');
  });
});
