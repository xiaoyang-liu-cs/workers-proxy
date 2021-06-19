import { selectUpstream } from './load-balancing';
import { getFirewallResponse } from './firewall';
import { setRequestHeaders, setResponseHeaders } from './headers';
import { getUpstreamResponse } from './upstream';
import { getCORSResponse } from './cors';
import { getErrorResponse } from './error';
import { Configuration } from './types';

class RocketBooster {
  config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
  }

  async apply(request: Request): Promise<Response> {
    const firewallResponse = getFirewallResponse(
      request,
      this.config.firewall,
    );
    if (firewallResponse !== null) {
      return firewallResponse;
    }

    const headersRequest = setRequestHeaders(
      request,
      this.config.header,
      this.config.security,
    );

    const upstream = selectUpstream(
      this.config.upstream,
      this.config.loadBalancing,
    );
    const upstreamResponse = await getUpstreamResponse(
      headersRequest,
      upstream,
      this.config.optimization,
    );

    if (
      upstreamResponse.status === 101
      && upstreamResponse.headers.get('upgrade') === 'websocket'
    ) {
      return upstreamResponse;
    }

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

    const headersResponse = setResponseHeaders(
      corsResponse,
      this.config.header,
    );
    return headersResponse;
  }
}

export default RocketBooster;
