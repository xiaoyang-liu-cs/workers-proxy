import { HeaderOptions, SecurityOptions } from './types';

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
  securityOptions?: SecurityOptions,
): Request => {
  if (headerOptions === undefined || headerOptions.request === undefined) {
    return request;
  }

  if (
    securityOptions !== undefined
    && securityOptions.forwarded
  ) {
    setForwardedHeaders(request);
  }
  for (const [key, value] of Object.entries(headerOptions.request)) {
    request.headers.set(key, value);
  }
  return request;
};

export const setResponseHeaders = (
  response: Response,
  headerOptions?: HeaderOptions,
  securityOptions?: SecurityOptions,
): Response => {
  if (securityOptions === undefined) {
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
  } = securityOptions;

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

  if (
    headerOptions !== undefined
    && headerOptions.response !== undefined
  ) {
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
