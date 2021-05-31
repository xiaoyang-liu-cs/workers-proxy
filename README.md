![Header](https://raw.githubusercontent.com/rocket-booster/rocket-booster/master/.github/img/header.png)

<div align="center">

[![GitHub Actions](https://img.shields.io/github/workflow/status/rocket-booster/rocket-booster/Node.js%20Test%20and%20Build?style=for-the-badge&logo=github)](https://github.com/rocket-booster/rocket-booster/actions)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/rocket-booster/rocket-booster?style=for-the-badge&logo=codecov)](https://app.codecov.io/gh/rocket-booster/rocket-booster/)
[![Package version](https://img.shields.io/npm/v/rocket-booster?style=for-the-badge&logo=npm&color=red)](https://www.npmjs.com/package/rocket-booster)
[![Bundle size](https://img.shields.io/bundlephobia/min/rocket-booster?style=for-the-badge&logo=webpack)](https://www.npmjs.com/package/rocket-booster)

[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

[Releases](https://github.com/rocket-booster/rocket-booster/releases) |
[Examples](#examples) |
[Contribute](#contribute) |
[Buy Me a Coffee](https://www.buymeacoffee.com/xiaoyangliu)

</div>

**Rocket Booster** is a serverless reverse proxy and load balancer library built for [Cloudflare Workers](https://workers.cloudflare.com). It sits in front of web servers (e.g. web application, storage platform, or RESTful API), forwards requests from clients to upstream servers, and transforms responses with several optimizations to improve critical loading times.

- Serverless: Deploy instantly to the auto-scaling serverless platform built by Cloudflare. No virtual machines, servers, or containers to manage.
- Security: Enable HTTPS, HTTP/3 (with QUIC), TLS 1.3, and IPv6 for web applications.
- Optimization: Minify HTML/CSS/JS files, compress images, cache static assets.
- Cross-Origin: Add necessary CORS headers to the proxied response.
- Firewall: Block traffics from specific IP addresses, countries, or scrapers.
- Load Balancing: Distribute incoming traffics evenly among different servers.

## Build and Deploy

### Integrate with existing project

- Install Rocket Booster with NPM

```sh
npm install --save rocket-booster
```

- Import the `RocketBooster` class from `rocket-booster` and instantiate the class with a configuration object. The `apply()` function takes an inbound [Request](https://developers.cloudflare.com/workers/runtime-apis/request) to the Worker, and returns the [Response](https://developers.cloudflare.com/workers/runtime-apis/request) from the upstream server.

```ts
import RocketBooster from 'rocket-booster';

const config = {
  upstream: {
    domain:  'example.com',
    protocol: 'https',
  },
};

addEventListener('fetch', (event) => {
  const booster = new RocketBooster(config);
  const response = booster.apply(event.request);
  event.respondWith(response);
});
```

- Change the configuartion object to modify the response. For example, the configuration below will add the header `Access-Control-Allow-Origin: *` to each response from the upstream server, which allows any origin to access the server.

```ts
const config = {
  upstream: {
    domain:  'example.com',
    protocol: 'https',
  },
  cors: {
    origin: '*',
  },
};
```

- Build and publish to Cloudflare Workers

```sh
wrangler build
wrangler publish
```

### Start from scratch

- [Install Wrangler CLI](https://github.com/cloudflare/wrangler#installation)

```sh
npm install -g @cloudflare/wrangler
```

- Generate from [rocket-booster-template](https://github.com/rocket-booster/rocket-booster-template)

```sh
wrangler generate booster https://github.com/rocket-booster/rocket-booster-template
```

- Install dependencies

```sh
cd booster
npm install
```

- Authenticate Wrangler with a Cloudflare API Token

```sh
wrangler login
wrangler config
```

- Edit `src/index.js` to configure Rocket Booster

- Build and publish to Cloudflare Workers

```sh
wrangler build
wrangler publish
```

## Configuration

### Upstream

- `domain`: The domain name of the upstream server.
- `protocol`: The protocol scheme of the upstream server. (Optional)
- `port`: The port of the upstream server. (Optional)
- `path`: The path of the upstream server. (Optional)
- `timeout`: The maximum wait time on a request to the upstream server.  (Optional)

```ts
const config = {
  upstream: {
    domain: 'httpbin.org',
    protocol: 'https',
    port: 443,
    path: '/',
    timeout: 10000,
  },
  /* ... */
};
```

To load balance HTTP traffic to a group of servers, pass an array of server objects to `upstream`. Each request will be passed to a randomly selected server.

```ts
const config = {
  upstream: [
    {
      domain: 's1.example.com',
      protocol: 'https',
    },
    {
      domain: 's2.example.com',
      protocol: 'https',
    },
    {
      domain: 's3.example.com',
      protocol: 'https',
    },
  ],
  /* ... */
};
```

### Optimization

- `minify`: Remove unnecessary characters (like whitespace, comments, etc.) from HTML, CSS, and JavaScript files.
- `mirage`: Detect screen size and connection speed to optimally deliver images for the current browser window.

```ts
const config = {
  /* ... */
  optimization: {
    mirage: true,
    minify: {
      javascript: true,
      css: true,
      html: true,
    },
  },
};
```

Several optimizations are enabled by default.

- [Brotli](https://brotli.org/): Speed up page load times for visitor’s HTTPS traffic by applying Brotli compression.
- [HTTP/2](https://developers.google.com/web/fundamentals/performance/http2): Improve page load time by connection multiplexing, header compression, and server push.
- [HTTP/3 with QUIC](https://en.wikipedia.org/wiki/HTTP/3): Accelerate HTTP requests by using QUIC, which provides encryption and performance improvements compared to TCP and TLS.
- 0-RTT Connection Resumption: Improve performance for clients who have previously connected to the website.

### Cross-Origin Resource Sharing (CORS)

- `origin`: Configures the `Access-Control-Allow-Origin` CORS header. Possible values:
  - `boolean`: set to `true` to reflect the request origin, or set to `false` to disable CORS.
  - `string[]`: an array of acceptable origins.
  - `*`: allow any origin to access the resource.

- `methods`: Configures the `Access-Control-Allow-Methods` CORS header. Expects an array of valid HTTP methods or `*`. If not specified, defaults to reflecting the method specified in the request’s `Access-Control-Request-Method` header.

- `allowedHeaders`: Configures the `Access-Control-Allow-Headers` CORS header. Expects an array of HTTP headers or *. If not specified, defaults to reflecting the headers specified in the request’s `Access-Control-Request-Headers` header.

- `exposedHeaders`: Configures the `Access-Control-Expose-Headers` CORS header. Expects an array of HTTP headers or `*`. If not specified, no custom headers are exposed.

- `credentials`: Configures the `Access-Control-Allow-Credentials` CORS header. Set to true to pass the header, otherwise it is omitted.

- `maxAge`: Configures the `Access-Control-Max-Age` CORS header. Set to an integer to pass the header, otherwise it is omitted.

```ts
const config = {
  /* ... */
  cors: {
    origin: true,
    methods: [
      'GET',
      'POST',
    ],
    allowHeaders: [
      'Example-Header',
    ],
    exposeHeaders: [
      'Example-Header',
    ],
    credentials: true,
    maxAge: 86400,
  },
};
```

### Custom Error Response

- `origin`: The HTTP status code to return a custom error response to the client. Excepts a valid HTTP status code or an array of valid status code.

- `responsePath`: The path and file name of the custom error page for this HTTP status code. For example: `/error-pages/403-forbidden.html`

- `responseCode`: The HTTP status code to return to the client along with the custom error page. If not specified, defaults to the original error code.

```ts
const config = {
  /* ... */
  error: {
    errorCode: 404,
    responsePath: '/404.html',
  },
};
```

To customize the response of multiple error codes, pass an array of error response objects to `error`.

```ts
const config = {
  /* ... */
  error: [
    {
      errorCode: 404,
      responsePath: '/404.html',
    },
    {
      errorCode: [500, 501, 502, 503],
      responsePath: '/500.html',
      responseCode: 500,
    },
  ],
};
```

## Contributing

- **Request a feature**: Create an issue with the **Feature request** template.
- **Report bugs**: Create an issue with the **Bug report** template.
- **Add new feature or fix bugs**: Fork this repository, edit code, and send a pull request.

### Current contributors

[![Contributors](https://contributors-img.web.app/image?repo=rocket-booster/rocket-booster)](https://github.com/rocket-booster/rocket-booster/graphs/contributors)
