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

    if (Array.isArray(origins)) {
      const requestOrigin = request.headers.get('Origin');
      if (
        requestOrigin !== null
        && origins.includes(requestOrigin)
      ) {
        response.headers.set(
          'Access-Control-Allow-Origin',
          requestOrigin,
        );
      }
    } else if (origins === '*') {
      response.headers.set(
        'Access-Control-Allow-Origin',
        '*',
      );
    }

    if (Array.isArray(methods)) {
      response.headers.set(
        'Access-Control-Allow-Methods',
        methods.join(','),
      );
    } else if (methods === '*') {
      response.headers.set(
        'Access-Control-Allow-Methods',
        '*',
      );
    }

    if (Array.isArray(exposeHeaders)) {
      response.headers.set(
        'Access-Control-Expose-Headers',
        exposeHeaders.join(','),
      );
    } else if (exposeHeaders === '*') {
      response.headers.set(
        'Access-Control-Expose-Headers',
        '*',
      );
    }

    if (Array.isArray(allowHeaders)) {
      response.headers.set(
        'Access-Control-Allow-Headers',
        allowHeaders.join(','),
      );
    } else if (allowHeaders === '*') {
      response.headers.set(
        'Access-Control-Allow-Headers',
        '*',
      );
    }

    if (credentials !== undefined) {
      response.headers.set(
        'Access-Control-Allow-Credentials',
        credentials.toString(),
      );
    }

    if (maxAge !== undefined) {
      response.headers.set(
        'Access-Control-Max-Age',
        maxAge.toString(),
      );
    }

    return response;
  }
}

export default CORS;
