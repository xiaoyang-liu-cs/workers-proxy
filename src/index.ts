import Firewall from './firewall';
import Upstream from './upstream';
import LoadBalancer from './load-balancer';
import { Configuration } from './types';
import CORS from './cors';

class RocketBooster {
  config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
  }

  async apply(request: Request): Promise<Response | null> {
    const firewall = new Firewall(
      this.config.firewall,
    );
    const firewallResponse = firewall.getResponse(request);
    if (firewallResponse instanceof Response) {
      return firewallResponse;
    }

    const loadBalancer = new LoadBalancer(
      this.config.upstream,
      this.config.network,
    );
    const upstream = new Upstream(
      loadBalancer.select(),
      this.config.optimization,
    );
    const upstreamResponse = await upstream.getResponse(request);

    const cors = new CORS(
      this.config.cors,
    );
    const corsResponse = cors.transformResponse(upstreamResponse);

    return corsResponse;
  }
}

export default RocketBooster;
