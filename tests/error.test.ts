import { mocked } from 'ts-jest/utils';
import * as upstream from '../src/upstream';
import { getErrorResponse } from '../src/error';

jest.mock('../src/upstream');

test('error.ts -> getErrorResponse()', async () => {
  const response = new Response(
    'Test response body',
    {
      status: 400,
    },
  );
  const upstreamOption = {
    domain: 'https://httpbin.org',
  };

  const mockResponse = new Response(
    'Test error response body',
    {
      status: 200,
    },
  );
  mocked(upstream).getUpstreamResponse.mockResolvedValue(mockResponse);

  const errorResponse = await getErrorResponse(
    response,
    upstreamOption,
  );
  expect(errorResponse).toBe(response);

  const errorResponse1 = await getErrorResponse(
    response,
    upstreamOption,
    [],
  );
  expect(errorResponse1).toBe(response);

  const errorOption2 = {
    errorCode: [400, 401],
    responsePath: '/path',
    responseCode: 403,
  };
  const errorResponse2 = await getErrorResponse(
    response,
    upstreamOption,
    errorOption2,
  );
  expect(errorResponse2.body).toEqual('Test error response body');
  expect(errorResponse2.status).toEqual(403);

  const errorOption3 = [{
    errorCode: 400,
    responsePath: '/path',
  }];
  const errorResponse3 = await getErrorResponse(
    response,
    upstreamOption,
    errorOption3,
  );
  expect(errorResponse3.body).toEqual('Test error response body');
  expect(errorResponse3.status).toEqual(400);
});
