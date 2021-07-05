import { Middleware } from '../types/middleware';

export const setForwardedHeaders = (
  headers: Headers,
): void => {
  headers.set('X-Forwarded-Proto', 'https');

  const host = headers.get('Host');
  if (host !== null) {
    headers.set('X-Forwarded-Host', host);
  }

  const ip = headers.get('cf-connecting-ip');
  const forwardedForHeader = headers.get('X-Forwarded-For');
  if (ip !== null && forwardedForHeader === null) {
    headers.set('X-Forwarded-For', ip);
  }
};

export const useRequestHeaders: Middleware = (
  context,
  next,
) => {
  const { request, options } = context;

  const securityOptions = options.security;
  const headers = new Headers(request.headers);
  if (
    securityOptions !== undefined
    && securityOptions.forwarded === true
  ) {
    setForwardedHeaders(headers);
  }

  const headerOptions = options.header;
  if (
    headerOptions !== undefined
    && headerOptions.request !== undefined
  ) {
    for (const [key, value] of Object.entries(headerOptions.request)) {
      headers.set(key, value);
    }
  }

  context.request = new Request(request.url, {
    body: request.body,
    method: request.method,
    headers,
  });
  return next();
};

export const useResponseHeaders: Middleware = (
  context,
  next,
) => {
  const { response, hostname, options } = context;
  const securityOptions = options.security;
  if (securityOptions === undefined) {
    return next();
  }

  const headers = new Headers(
    response.headers,
  );

  const {
    xssFilter,
    noSniff,
    hidePoweredBy,
    ieNoOpen,
    setCookie,
  } = securityOptions;

  if (xssFilter) {
    headers.set('X-XSS-Protection', '0');
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

  const setCookieHeader = headers.get('set-cookie');
  if (
    setCookieHeader !== null
    && setCookie
  ) {
    const setCookieAttributes = setCookieHeader.split(';').map((attribute) => {
      if (attribute.toLowerCase().trim().startsWith('domain=')) {
        return `domain=${hostname}`;
      }
      return attribute.trim();
    });
    headers.set('Set-Cookie', setCookieAttributes.join(';'));
  }

  const pjaxHeader = headers.get('x-pjax-url');
  if (pjaxHeader !== null) {
    const pjaxUrl = new URL(pjaxHeader);
    pjaxUrl.hostname = hostname;
    headers.set('x-pjax-url', pjaxUrl.href);
  }

  const headerOptions = options.header;
  if (
    headerOptions !== undefined
    && headerOptions.response !== undefined
  ) {
    for (const [key, value] of Object.entries(headerOptions.response)) {
      headers.set(key, value);
    }
  }

  context.response = new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers,
    },
  );
  return next();
};
