import { Middleware } from '../types/middleware';

export const useSelectUpstream: Middleware = (
  context,
  next,
) => {
  const { options } = context;
  const upstreamOptions = options.upstream;

  const upstream = Array.isArray(upstreamOptions) ? upstreamOptions : [upstreamOptions];
  context.upstream = upstream[Math.floor(Math.random() * upstream.length)];

  return next();
};
