import { getFirewallResponse } from './firewall';
import { getUpstreamResponse } from './upstream';
import LoadBalancer from './load-balancer';
import { Configuration } from './types';

class RocketBooster {
  config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
  }

  async apply(request: Request): Promise<Response | null> {
    const firewallResponse = getFirewallResponse(
      request,
      this.config.firewall,
    );
    if (firewallResponse instanceof Response) {
      return firewallResponse;
    }

    const loadBalancer = new LoadBalancer(
      this.config.upstream,
      this.config.network,
    );
    const upstream = loadBalancer.select();

    const upstreamResponse = await getUpstreamResponse(
      request,
      upstream,
      this.config.optimization,
    );
    if (!upstreamResponse.ok) {
      return upstreamResponse;
    }

    return null;
  }
}

export default RocketBooster;
