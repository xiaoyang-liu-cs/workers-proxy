import { Middleware } from '../types/middleware';
import { ErrorOptions } from '../types/custom-error';
import { UpstreamOptions } from '../types/upstream';
import { getURL, sendRequest } from './upstream';

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
  const url = getURL(`https://example.com/${responsePath}`, upstream);
  const timeout = upstream.timeout || 10000;
  const request = new Request(url);
  const response = await sendRequest(request, timeout);
  return new Response(
    response.body,
    {
      status: responseCode,
      headers: response.headers,
    },
  );
};

export const useCustomError: Middleware = async (
  context,
  next,
) => {
  const { response, options, upstream } = context;
  const errorOptions = options.error;
  if (errorOptions === undefined || upstream === null) {
    return next();
  }

  const errorRules: ErrorOptions[] = [];
  if (Array.isArray(errorOptions)) {
    errorRules.push(...errorOptions);
  } else {
    errorRules.push(errorOptions);
  }

  for await (const errorRule of errorRules) {
    const {
      errorCode,
      responsePath,
      responseCode = response.status,
    } = errorRule;
    if (checkErrorCode(response, errorCode)) {
      context.response = await getErrorPage(
        upstream,
        responsePath,
        responseCode,
      );
      break;
    }
  }
  return next();
};
