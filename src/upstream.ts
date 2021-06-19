import { createResponse } from './utils';
import { UpstreamOptions, OptimizationOptions } from './types';

const cloneRequest = (
  url: string,
  request: Request,
  optimization?: OptimizationOptions,
): Request => {
  const requestInit: CfRequestInit = {
    body: request.body,
    method: request.method,
    headers: request.headers,
    redirect: 'follow',
  };

  if (optimization !== undefined) {
    requestInit.cf = {
      mirage: optimization.mirage,
      minify: optimization.minify,
    };
  }
  return new Request(url, requestInit);
};

const getURL = (
  url: string,
  upstream: UpstreamOptions,
): string => {
  const cloneURL = new URL(url);
  const {
    domain,
    port,
    path,
    protocol,
  } = upstream;

  cloneURL.hostname = domain;

  if (port !== undefined) {
    cloneURL.port = port.toString();
  }
  if (path !== undefined) {
    cloneURL.pathname = `${path}${cloneURL.pathname}`;
  }
  if (protocol !== undefined) {
    cloneURL.protocol = `${protocol}:`;
  }
  return cloneURL.href;
};

const sendRequest = async (
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

export const getUpstreamResponse = async (
  request: Request,
  upstream: UpstreamOptions,
  optimization?: OptimizationOptions,
): Promise<Response> => {
  const timeout = upstream.timeout || 10000;
  const url = getURL(
    request.url,
    upstream,
  );
  const upstreamRequest = cloneRequest(
    url,
    request,
    optimization,
  );

  try {
    const response = await sendRequest(
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
