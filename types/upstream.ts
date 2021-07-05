export interface UpstreamOptions {
  domain: string;
  protocol?: 'http' | 'https';
  port?: number;
  path?: string;
  timeout?: number;
  retry?: number;
  weight?: number;
}
