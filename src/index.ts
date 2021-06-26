import { selectUpstream } from './load-balancing';
import { getFirewallResponse } from './firewall';
import { setRequestHeaders, setResponseHeaders } from './headers';
import { getUpstreamResponse } from './upstream';
import { getCORSResponse } from './cors';
import { getErrorResponse } from './error';
import { getHostname } from './utils';
import { Proxy, Configuration } from './types';

export default function useProxy(
  config: Configuration,
): Proxy {
  const apply = async (request: Request): Promise<Response> => {
    const hostname = getHostname(request);

    const firewallResponse = getFirewallResponse(
      request,
      config.firewall,
    );
    if (firewallResponse !== null) {
      return firewallResponse;
    }

    const headersRequest = setRequestHeaders(
      request,
      config.header,
      config.security,
    );

    const upstream = selectUpstream(
      config.upstream,
      config.loadBalancing,
    );
    const upstreamResponse = await getUpstreamResponse(
      headersRequest,
      upstream,
      config.optimization,
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
      config.error,
    );

    const corsResponse = getCORSResponse(
      request,
      errorResponse,
      config.cors,
    );

    const headersResponse = setResponseHeaders(
      corsResponse,
      hostname,
      config.header,
      config.security,
    );
    return headersResponse;
  };

  return {
    apply,
  };
}
