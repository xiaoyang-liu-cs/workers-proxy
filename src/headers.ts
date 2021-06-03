import { HeaderOptions } from './types';

export const setForwardedHeaders = (
  request: Request,
): void => {
  request.headers.set('X-Forwarded-Proto', 'https');

  const host = request.headers.get('Host');
  if (host !== null) {
    request.headers.set('X-Forwarded-Host', host);
  }

  const ip = request.headers.get('cf-connecting-ip');
  if (ip !== null) {
    const forwardedForHeader = request.headers.get('X-Forwarded-For');
    if (forwardedForHeader === null) {
      request.headers.set('X-Forwarded-For', ip);
    } else {
      request.headers.set('X-Forwarded-For', `${forwardedForHeader}, ${ip}`);
    }
  }
};

export const setRequestHeaders = (
  request: Request,
  headerOptions?: HeaderOptions,
): void => {
  if (headerOptions === undefined || headerOptions.request === undefined) {
    return;
  }

  setForwardedHeaders(request);
  for (const [key, value] of Object.entries(headerOptions.request)) {
    request.headers.set(key, value);
  }
};

export const setResponseHeaders = (
  response: Response,
  headerOptions?: HeaderOptions,
): Response => {
  if (headerOptions === undefined) {
    return response;
  }

  const headers = new Headers(
    response.headers,
  );

  const {
    xssFilter,
    noSniff,
    hidePoweredBy,
    ieNoOpen,
  } = headerOptions;

  if (xssFilter) {
    headers.set('X-XSS-Protectio', '0');
  }

  if (noSniff) {
    headers.set('X-Content-Type-Options', 'nosniff');
  }

  if (hidePoweredBy) {
    headers.delete('X-Powered-By');
  }

  if (ieNoOpen) {
    headers.set('X-Download-Options', 'noopen');
  }

  if (headerOptions.response !== undefined) {
    for (const [key, value] of Object.entries(headerOptions.response)) {
      headers.set(key, value);
    }
  }

  return new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers,
    },
  );
};
