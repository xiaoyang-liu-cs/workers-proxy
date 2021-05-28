import { ErrorOptions, UpstreamOptions } from './types';
import { getUpstreamResponse } from './upstream';

const checkErrorCode = (
  response: Response,
  errorCode: number | number[],
): boolean => {
  if (typeof errorCode === 'number') {
    return errorCode === response.status;
  }
  return errorCode.includes(response.status);
};

const getErrorPage = async (
  upstream: UpstreamOptions,
  responsePath: string,
  responseCode: number,
): Promise<Response> => {
  const request = new Request(`https://example.com/${responsePath}`);
  const response = await getUpstreamResponse(
    request,
    upstream,
  );
  return new Response(response.body, {
    status: responseCode,
    headers: response.headers,
  });
};

export const getErrorResponse = async (
  response: Response,
  upstream: UpstreamOptions,
  errorOptions?: ErrorOptions | ErrorOptions[],
): Promise<Response> => {
  if (errorOptions === undefined) {
    return response;
  }

  const errorRules: ErrorOptions[] = [];
  if (Array.isArray(errorOptions)) {
    errorRules.push(...errorOptions);
  } else {
    errorRules.push(errorOptions);
  }

  for (const errorRule of errorRules) {
    const {
      errorCode,
      responsePath,
      responseCode,
    } = errorRule;
    if (checkErrorCode(response, errorCode)) {
      if (responseCode === undefined) {
        return getErrorPage(upstream, responsePath, response.status);
      }
      return getErrorPage(upstream, responsePath, responseCode);
    }
  }
  return response;
};
