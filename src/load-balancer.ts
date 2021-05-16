import { UpstreamOptions, NetworkOptions, LoadBalancingMethod } from './types';

class LoadBalancer {
  method: LoadBalancingMethod;

  upstream: UpstreamOptions[];

  constructor(
    upstreamOptions: UpstreamOptions | UpstreamOptions[],
    networkOptions?: NetworkOptions,
  ) {
    this.upstream = Array.isArray(upstreamOptions) ? upstreamOptions : [upstreamOptions];

    if (
      networkOptions === undefined
      || networkOptions.loadBalancingMethod === undefined
    ) {
      this.method = 'random';
    } else {
      this.method = networkOptions.loadBalancingMethod;
    }
  }

  select(): UpstreamOptions {
    if (this.method === 'random') {
      return this.upstream[Math.floor(Math.random() * this.upstream.length)];
    }

    return this.upstream[0];
  }
}

export default LoadBalancer;
