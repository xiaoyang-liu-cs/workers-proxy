import { CORSOptions } from './types';

export const getCORSResponse = (
  request: Request,
  response: Response,
  corsOptions?: CORSOptions,
): Response => {
  if (corsOptions === undefined) {
    return response;
  }

  const {
    origin,
    methods,
    exposedHeaders,
    allowedHeaders,
    credentials,
    maxAge,
  } = corsOptions;

  const corsHeaders = new Headers(
    response.headers,
  );

  const requestOrigin = request.headers.get('origin');
  if (requestOrigin === null || origin === false) {
    return response;
  }

  if (origin === true) {
    corsHeaders.set('Access-Control-Allow-Origin', requestOrigin);
  } else if (Array.isArray(origin)) {
    if (origin.includes(requestOrigin)) {
      corsHeaders.set('Access-Control-Allow-Origin', requestOrigin);
    }
  } else if (origin === '*') {
    corsHeaders.set('Access-Control-Allow-Origin', '*');
  }

  if (Array.isArray(methods)) {
    corsHeaders.set('Access-Control-Allow-Methods', methods.join(','));
  } else if (methods === '*') {
    corsHeaders.set('Access-Control-Allow-Methods', '*');
  } else {
    const requestMethod = request.headers.get('Access-Control-Request-Method');
    if (requestMethod !== null) {
      corsHeaders.set('Access-Control-Allow-Methods', requestMethod);
    }
  }

  if (Array.isArray(exposedHeaders)) {
    corsHeaders.set('Access-Control-Expose-Headers', exposedHeaders.join(','));
  } else if (exposedHeaders === '*') {
    corsHeaders.set('Access-Control-Expose-Headers', '*');
  }

  if (Array.isArray(allowedHeaders)) {
    corsHeaders.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
  } else if (allowedHeaders === '*') {
    corsHeaders.set('Access-Control-Allow-Headers', '*');
  } else {
    const requestHeaders = request.headers.get('Access-Control-Request-Headers');
    if (requestHeaders !== null) {
      corsHeaders.set('Access-Control-Allow-Headers', requestHeaders);
    }
  }

  if (credentials === true) {
    corsHeaders.set('Access-Control-Allow-Credentials', 'true');
  }

  if (maxAge !== undefined && Number.isInteger(maxAge)) {
    corsHeaders.set('Access-Control-Max-Age', maxAge.toString());
  }

  return new Response(
    response.body,
    {
      status: response.status,
      statusText: response.statusText,
      headers: corsHeaders,
    },
  );
};
