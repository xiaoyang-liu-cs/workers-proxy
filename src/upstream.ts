import { createResponse } from './utils';
import { UpstreamOptions, OptimizationOptions } from './types';

class Upstream {
  upstream: UpstreamOptions;

  optimization?: OptimizationOptions;

  constructor(
    upstream: UpstreamOptions,
    optimization?: OptimizationOptions,
  ) {
    this.upstream = upstream;
    this.optimization = optimization;
  }

  getResponse = async (
    request: Request,
  ): Promise<Response> => {
    const url = this.getURL(request.url);
    const timeout = this.upstream.timeout || 10000;
    const upstreamRequest = this.cloneRequest(
      url,
      request,
    );

    try {
      const response = await this.sendRequest(
        upstreamRequest,
        timeout,
      );
      return response;
    } catch (error) {
      return createResponse(
        'Error: Request Timeout',
        408,
      );
    }
  };

  cloneRequest = (
    url: string,
    request: Request,
  ): Request => {
    const cloneHeaders = new Headers(request.headers);
    if (this.upstream.headers !== undefined) {
      for (const [name, value] of Object.entries(this.upstream.headers)) {
        cloneHeaders.set(name, value);
      }
    }

    const requestInit: CfRequestInit = {
      body: request.body,
      method: request.method,
      headers: cloneHeaders,
      redirect: 'follow',
    };

    if (this.optimization !== undefined) {
      requestInit.cf = {
        mirage: this.optimization.mirage,
        minify: this.optimization.minify,
      };
    }
    return new Request(url, requestInit);
  };

  getURL = (
    url: string,
  ): string => {
    const cloneURL = new URL(url);
    cloneURL.hostname = this.upstream.domain;

    if (this.upstream.port !== undefined) {
      cloneURL.port = this.upstream.port.toString();
    }
    if (this.upstream.path !== undefined) {
      cloneURL.pathname = `${this.upstream.path}${cloneURL.pathname}`;
    }
    if (this.upstream.protocol !== undefined) {
      cloneURL.protocol = `${this.upstream.protocol}:`;
    }
    return cloneURL.href;
  };

  sendRequest = async (
    request: Request,
    timeout: number,
  ): Promise<Response> => {
    const timeoutId = setTimeout(() => {
      throw new Error('Fetch Timeout');
    }, timeout);

    const response = await fetch(request);
    clearTimeout(timeoutId);
    return response;
  };
}

export default Upstream;
