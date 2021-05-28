import { selectUpstream } from './load-balancer';
import { getFirewallResponse } from './firewall';
import { getUpstreamResponse } from './upstream';
import { getCORSResponse } from './cors';
import { getErrorResponse } from './error';
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

    const upstream = selectUpstream(
      this.config.upstream,
      this.config.network,
    );
    const upstreamResponse = await getUpstreamResponse(
      request,
      upstream,
      this.config.optimization,
    );

    const errorResponse = await getErrorResponse(
      upstreamResponse,
      upstream,
      this.config.error,
    );

    const corsResponse = getCORSResponse(
      request,
      errorResponse,
      this.config.cors,
    );

    return corsResponse;
  }
}

export default RocketBooster;
