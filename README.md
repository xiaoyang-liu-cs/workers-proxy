[![Header](https://raw.githubusercontent.com/rocket-booster/rocket-booster/master/.github/img/header.png)](https://github.com//rocket-booster/rocket-booster)

<div align="center">

![GitHub Actions](https://img.shields.io/github/workflow/status/rocket-booster/rocket-booster/Node.js%20Test%20and%20Build?style=for-the-badge&logo=github)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/rocket-booster/rocket-booster?style=for-the-badge&logo=codecov)](https://app.codecov.io/gh/rocket-booster/rocket-booster/)
[![Package version](https://img.shields.io/npm/v/rocket-booster?style=for-the-badge&logo=npm&color=red)](https://www.npmjs.com/package/rocket-booster)
[![Bundle size](https://img.shields.io/bundlephobia/min/rocket-booster?style=for-the-badge&logo=webpack)](https://www.npmjs.com/package/rocket-booster)

[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/powered-by-netflix.svg)](https://forthebadge.com)

[Releases](https://github.com/rocket-booster/rocket-booster/releases) |
[Examples](#examples) |
[Contribute](#contribute) |
[Buy Me a Coffee](https://www.buymeacoffee.com/xiaoyangliu)

</div>

**Rocket Booster** is the edge-rendered speed booster for web applications, storage platforms, and RESTful APIs. It's a reverse proxy that sits in front of web servers, intercepting requests from clients.

- Performance: Deploy to a network of data centers powered by Cloudflare.
- Serverless: No VMs, no servers, and no containers to spin up or manage.
- Optimization: Minify HTML/CSS/JS files, compress images, cache static assets.
- Cross-Origin: Add necessary CORS headers to the proxied response.
- Firewall: Block traffics from specific IP addresses, countries, or User-Agent.
- Network: Enable HTTPS, HTTP/3 (with QUIC), TLS 1.3, and IPv6 for web applications.
- Load Balance: Distribute incoming traffics evenly among different servers.

## Build and Deploy

1. [Install Wrangler CLI](https://github.com/cloudflare/wrangler#installation)

```sh
npm install @cloudflare/wrangler -g
```

2. Generate from [rocket-booster-template](https://github.com/rocket-booster/rocket-booster-template)

```sh
wrangler generate booster https://github.com/rocket-booster/rocket-booster-template
```

3. Install dependencies

```sh
cd booster

npm install
```

4. Authenticate Wrangler with a Cloudflare API Token

```sh
wrangler login

wrangler config
```

5. Edit `src/index.js` to configure Rocket Booster

6. Build and publish to Cloudflare Workers

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

- `origins`: The origins to allow requests from.
- `methods`: The methods which the origins are allowed to access.
- `allowHeaders`: Headers to accept from the client.
- `exposeHeaders`: Give explicit permissions for the client to read headers in CORS responses.
- `credentials`: Inject the `Access-Control-Allow-Credentials` header in responses.
- `maxAge`: Specify the value in seconds for how long the response to the preflight request can be cached for.

```ts
const config = {
  /* ... */
  cors: {
    origins: [
      'https://example.com',
    ],
    methods: [
      'GET',
      'POST',
    ],
    allowHeaders: [
      'X-Forwarded-For',
    ],
    exposeHeaders: [
      'X-Forwarded-For',
    ],
    credentials: true,
    maxAge: 86400,
  },
};
```

## Contribute

- `Feature Request`: Create an issue with the **Feature request** template.
- `Bug Reports`: Create an issue with the **Bug report** template.
- `Improvements to the booster.js`: Fork the repository, edit code, deploy it to Cloudflare Workers, and then create a pull request.
- `Add Config Examples`: Fork the repository, write an example config for any website, save it to the `examples` directory, and then create a pull request.

### Current contributors

[![Contributors](https://contributors-img.web.app/image?repo=rocket-booster/rocket-booster)](https://github.com/rocket-booster/rocket-booster/graphs/contributors)

## Support Rocket Booster

We accept donations through these channels:

- [Buy Me a Coffee](https://www.buymeacoffee.com/xiaoyangliu)
- Bitcoin: 1Eb4n6eEyyKjbu3feA9oAQAnZo1K46UvXN
- Ethereum: 0x16145d98625c0b2aa265773970ca090bf783d5ae
