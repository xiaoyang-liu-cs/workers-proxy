import { getFirewallResponse } from './firewall';
import { getUpstreamResponse } from './upstream';
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

    const upstreamResponse = await getUpstreamResponse(
      request,
      this.config.upstream,
    );
    if (!upstreamResponse.ok) {
      return upstreamResponse;
    }

    return null;
  }
}

export default RocketBooster;
