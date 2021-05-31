import { UpstreamOptions, LoadBalancingOptions } from './types';

export const selectUpstream = (
  upstreamOptions: UpstreamOptions | UpstreamOptions[],
  loadBalancingOptions?: LoadBalancingOptions,
): UpstreamOptions => {
  const method = loadBalancingOptions === undefined ? 'random' : loadBalancingOptions.method;
  const upstream = Array.isArray(upstreamOptions) ? upstreamOptions : [upstreamOptions];
  if (method === 'random') {
    return upstream[Math.floor(Math.random() * upstream.length)];
  }
  return upstream[0];
};
