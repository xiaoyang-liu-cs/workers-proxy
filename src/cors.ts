import { CORSOptions } from './types';

class CORS {
  corsOptions?: CORSOptions;

  constructor(
    corsOptions?: CORSOptions,
  ) {
    this.corsOptions = corsOptions;
  }

  transformResponse(
    request: Request,
    response: Response,
  ): Response {
    if (this.corsOptions === undefined) {
      return response;
    }

    const {
      origins,
      methods,
      exposeHeaders,
      allowHeaders,
      credentials,
      maxAge,
    } = this.corsOptions;

    const corsHeaders = new Headers(
      response.headers,
    );

    if (Array.isArray(origins)) {
      const requestOrigin = request.headers.get('Origin');
      if (
        requestOrigin !== null
        && origins.includes(requestOrigin)
      ) {
        corsHeaders.set(
          'Access-Control-Allow-Origin',
          requestOrigin,
        );
      }
    } else if (origins === '*') {
      corsHeaders.set(
        'Access-Control-Allow-Origin',
        '*',
      );
    }

    if (Array.isArray(methods)) {
      corsHeaders.set(
        'Access-Control-Allow-Methods',
        methods.join(','),
      );
    } else if (methods === '*') {
      corsHeaders.set(
        'Access-Control-Allow-Methods',
        '*',
      );
    }

    if (Array.isArray(exposeHeaders)) {
      corsHeaders.set(
        'Access-Control-Expose-Headers',
        exposeHeaders.join(','),
      );
    } else if (exposeHeaders === '*') {
      corsHeaders.set(
        'Access-Control-Expose-Headers',
        '*',
      );
    }

    if (Array.isArray(allowHeaders)) {
      corsHeaders.set(
        'Access-Control-Allow-Headers',
        allowHeaders.join(','),
      );
    } else if (allowHeaders === '*') {
      corsHeaders.set(
        'Access-Control-Allow-Headers',
        '*',
      );
    }

    if (credentials !== undefined) {
      corsHeaders.set(
        'Access-Control-Allow-Credentials',
        credentials.toString(),
      );
    }

    if (maxAge !== undefined) {
      corsHeaders.set(
        'Access-Control-Max-Age',
        maxAge.toString(),
      );
    }

    return new Response(
      response.body,
      {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders,
      },
    );
  }
}

export default CORS;
