import { CORSOptions } from './types';

class CORS {
  corsOptions?: CORSOptions;

  constructor(
    corsOptions?: CORSOptions,
  ) {
    this.corsOptions = corsOptions;
  }

  transformResponse(
    response: Response,
  ): Response {
    if (this.corsOptions === undefined) {
      return response;
    }

    if (Array.isArray(this.corsOptions.origins)) {
      const allowOrigin = this.corsOptions.origins.join('');
      response.headers.set('Access-Control-Allow-Origin', );
    }
    return response;
  }
}

export default CORS;
