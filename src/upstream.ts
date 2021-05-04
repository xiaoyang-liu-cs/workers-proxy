import { createResponse } from './utils';
import { UpstreamOptions, OptimizationOptions } from './types';

const cloneRequest = (
  url: string,
  request: Request,
  headers?: {
    [key: string]: string;
  },
  optimization?: OptimizationOptions,
): Request => {
  const cloneHeaders = new Headers(request.headers);
  if (headers !== undefined) {
    for (const [name, value] of Object.entries(headers)) {
      cloneHeaders.set(name, value);
    }
  }

  const requestInit: RequestInit = {
    body: request.body,
    method: request.method,
    redirect: request.redirect,
    headers: cloneHeaders,
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
  upstreamOptions: UpstreamOptions,
): string => {
  const cloneURL = new URL(url);
  cloneURL.hostname = upstreamOptions.domain;

  if (upstreamOptions.port !== undefined) {
    cloneURL.port = upstreamOptions.port.toString();
  }
  if (upstreamOptions.path !== undefined) {
    cloneURL.pathname = `${upstreamOptions.path}${cloneURL.pathname}`;
  }
  if (upstreamOptions.protocol !== undefined) {
    cloneURL.protocol = `${upstreamOptions.protocol}:`;
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
  const url = getURL(request.url, upstream);
  const timeout = upstream.timeout || 100;
  const upstreamRequest = cloneRequest(
    url, request, upstream.headers, optimization,
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
