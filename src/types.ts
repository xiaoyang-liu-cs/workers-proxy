type HTTPMethod = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'TRACE' | 'CONNECT';

export interface UpstreamOptions {
  domain: string;
  protocol?: 'http' | 'https';
  port?: number;
  path?: string;
  timeout?: number;
  headers?: {
    [key: string]: string;
  };
  retry?: number;
  weight?: number;
}

export type FirewallFields = 'country' | 'continent' | 'asn' | 'ip' | 'hostname' | 'user-agent';
export type FirewallOperators = 'equal' | 'not equal' | 'greater' | 'less' | 'in' | 'not in' | 'contain' | 'not contain';
export interface FirewallOptions {
  field: FirewallFields;
  operator: FirewallOperators;
  value: string | string[] | number | number[];
}

export interface CORSOptions {
  origins?: string[] | '*';
  methods?: HTTPMethod[] | '*';
  exposeHeaders?: string[] | '*';
  allowHeaders?: string[] | '*';
  credentials?: boolean;
  maxAge?: number;
}

export type LoadBalancingMethod = 'round-robin' | 'ip-hash' | 'random';
export interface NetworkOptions {
  loadBalancingMethod?: LoadBalancingMethod;
  websocket?: boolean;
}

export interface CacheOptions {
  cacheEverything?: boolean;
}

export interface OptimizationOptions {
  mirage?: boolean;
  minify?: {
    javascript?: boolean;
    css?: boolean;
    html?: boolean;
  };
}

export interface Configuration {
  upstream: UpstreamOptions | UpstreamOptions[];
  firewall?: FirewallOptions | FirewallOptions[];
  cors?: CORSOptions;
  network?: NetworkOptions;
  cache?: CacheOptions;
  optimization?: OptimizationOptions;
}
