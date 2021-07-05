import { createResponse } from './utils';
import { UpstreamOptions } from '../types/upstream';
import { OptimizationOptions } from '../types/optimization';
import { Middleware } from '../types/middleware';

export const cloneRequest = (
  url: string,
  request: Request,
  optimization?: OptimizationOptions,
): Request => {
  const requestInit: CfRequestInit = {
    body: request.body,
    method: request.method,
    headers: request.headers,
  };

  if (optimization !== undefined) {
    requestInit.cf = {
      mirage: optimization.mirage,
      minify: optimization.minify,
    };
  }
  return new Request(url, requestInit);
};

export const getURL = (
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

export const sendRequest = async (
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

export const useUpstream: Middleware = async (
  context,
  next,
) => {
  const { request, upstream, options } = context;
  if (upstream === null) {
    return null;
  }

  const timeout = upstream.timeout || 10000;
  const url = getURL(
    request.url,
    upstream,
  );

  const optimizationOptions = options.optimization;
  const upstreamRequest = cloneRequest(
    url,
    request,
    optimizationOptions,
  );

  try {
    context.response = await sendRequest(
      upstreamRequest,
      timeout,
    );
    return next();
  } catch (error) {
    context.response = createResponse(
      error,
      500,
    );
    return null;
  }
};
