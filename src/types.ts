type HTTPMethod = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'TRACE' | 'CONNECT';

export interface UpstreamOptions {
  domain: string;
  protocol?: 'http' | 'https';
  port?: number;
  path?: string;
  timeout?: number;
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

export interface ErrorOptions {
  /**
   * The HTTP status code to return a custom error response to the client.
   * Excepts a valid HTTP status code or an array of valid status code.
   */
  errorCode: number | number[];

  /**
   * The path and file name of the custom error page for this HTTP status code.
   * For example: `/error-pages/403-forbidden.html`
   */
  responsePath: string;

  /**
   * The HTTP status code to return to the client along with the custom error page.
   * If not specified, defaults to the original error code.
   */
  responseCode?: number;
}

export interface CORSOptions {
  /**
   * Configures the `Access-Control-Allow-Origin` CORS header. Possible values:
   * - boolean - set to `true` to reflect the request origin,
   * or set to `false` to disable CORS.
   * - string[] - an array of acceptable origins.
   * - `*` - allow any origin to access the resource
   */
  origin?: boolean | string[] | '*';

  /**
   * Configures the `Access-Control-Allow-Methods` CORS header.
   * Expects an array of valid HTTP methods or `*`.
   * If not specified, defaults to reflecting the method specified
   * in the request’s `Access-Control-Request-Method` header.
   */
  methods?: HTTPMethod[] | '*';

  /**
   * Configures the `Access-Control-Expose-Headers` CORS header.
   * Expects an array of HTTP headers or `*`.
   * If not specified, no custom headers are exposed.
   */
  exposedHeaders?: string[] | '*';

  /**
   * Configures the `Access-Control-Allow-Headers` CORS header.
   * Expects an array of HTTP headers or `*`.
   * If not specified, defaults to reflecting the headers specified
   * in the request’s `Access-Control-Request-Headers` header.
   */
  allowedHeaders?: string[] | '*';

  /**
   * Configures the `Access-Control-Allow-Credentials` CORS header.
   * Set to `true` to pass the header, otherwise it is omitted.
   */
  credentials?: boolean;

  /**
   * Configures the `Access-Control-Max-Age` CORS header.
   * Set to an integer to pass the header, otherwise it is omitted.
   */
  maxAge?: number;
}

export interface LoadBalancingOptions {
  method?: 'round-robin' | 'ip-hash' | 'random';
}

export interface HeaderOptions {
  /**
   * Sets request header going upstream to the backend.
   */
  request?: {
    [key: string]: string;
  };

  /**
   * Sets response header coming downstream to the client.
   */
  response?: {
    [key: string]: string;
  };
}

export interface SecurityOptions {
  /**
   * Sets the `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Proto` headers.
   */
   forwarded?: boolean;

  /**
   * Removes the `X-Powered-By` header, which is set by default
   * in some frameworks such as Express.
   */
   hidePoweredBy?: boolean;

   /**
    * Sets the `X-Download-Options` header, which is specific to Internet Explorer 8.
    * It forces potentially-unsafe downloads to be saved, mitigating execution of HTML
    * in your site's context.
    */
   ieNoOpen?: boolean;

   /**
    * Sets the `X-XSS-Protection` header to `0`
    * to disable browsers' buggy cross-site scripting filter.
    */
   xssFilter?: boolean;

   /**
    * Sets the `X-Content-Type-Options` header to `nosniff`.
    * This mitigates MIME type sniffing which can cause security vulnerabilities.
    */
   noSniff?: boolean;

   /**
    * Sets the `Domain` attribute of the `Set-Cookie` header to the domain of the worker.
    */
   setCookie?: boolean;
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
  error?: ErrorOptions | ErrorOptions[];
  cors?: CORSOptions;
  optimization?: OptimizationOptions;
  loadBalancing?: LoadBalancingOptions;
  header?: HeaderOptions;
  security?: SecurityOptions;
}

export interface Proxy {
 apply: (request: Request) => Promise<Response>
}
