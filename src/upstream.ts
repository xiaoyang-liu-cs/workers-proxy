import { createResponse } from './utils';
import { UpstreamOptions } from './types';

const cloneRequest = (
  url: string,
  request: Request,
  headers?: {
    [key: string]: string;
  },
): Request => {
  const cloneHeaders = new Headers(request.headers);
  if (headers !== undefined) {
    for (const [name, value] of Object.entries(headers)) {
      cloneHeaders.set(name, value);
    }
  }

  return new Request(url, {
    body: request.body,
    method: request.method,
    redirect: request.redirect,
    headers: cloneHeaders,
  });
};

const loadBalancer = (
  upstreamOptions: UpstreamOptions | UpstreamOptions[],
): UpstreamOptions => {
  if (Array.isArray(upstreamOptions)) {
    return upstreamOptions[0];
  }
  return upstreamOptions;
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
  upstreamOptions: UpstreamOptions | UpstreamOptions[],
): Promise<Response> => {
  const upstream = loadBalancer(upstreamOptions);
  const url = getURL(request.url, upstream);
  const timeout = upstream.timeout || 100;
  const upstreamRequest = cloneRequest(url, request, upstream.headers);

  try {
    const response = await sendRequest(upstreamRequest, timeout);
    return response;
  } catch (error) {
    return createResponse(
      'Error: Request Timeout',
      408,
    );
  }
};
