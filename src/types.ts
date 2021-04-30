type HTTPMethod = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'TRACE' | 'CONNECT';

export interface OriginOptions {
  domain: string;
  protocol?: 'http' | 'https';
  port?: number;
  path?: string;
  timeout?: number;
  headers?: {
    [key: string]: string;
  };
  weight?: number;
}

export interface FirewallOptions {
  action: 'block' | 'allow';
  field: 'country' | 'continent' | 'asn' | 'ip' | 'hostname' | 'user-agent';
  value: string | string[] | RegExp | RegExp[];
}

export interface CORSOptions {
  origins?: string[] | '*';
  methods?: HTTPMethod[] | '*';
  exposeHeaders?: string[] | '*';
  allowHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export interface NetworkOptions {
  loadBalancer: 'round-robin' | 'ip-hash' | 'random';
  websocket?: boolean;
  geolocation?: boolean;
}

export interface CacheOptions {
  cacheEverything?: boolean;
}

export interface OptimizationOptions {
  mirage: boolean;
  minify?: {
    javascript?: boolean;
    css?: boolean;
    html?: boolean;
  };
}

export interface Configuration {
  origin: OriginOptions | OriginOptions[];
  firewall?: FirewallOptions | FirewallOptions[];
  cors?: CORSOptions;
  network?: NetworkOptions;
  cache?: CacheOptions;
  optimizatioin?: OptimizationOptions;
}
