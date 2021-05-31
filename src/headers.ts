export const setForwardedHeaders = (
  request: Request,
): Request => {
  request.headers.set('X-Forwarded-Proto', 'https');

  const host = request.headers.get('Host');
  if (host !== null) {
    request.headers.set('X-Forwarded-Host', host);
  }

  const ip = request.headers.get('cf-connecting-ip');
  if (ip !== null) {
    const forwardedForHeader = request.headers.get('X-Forwarded-For');
    if (forwardedForHeader === null) {
      request.headers.set('X-Forwarded-For', ip);
    } else {
      request.headers.set('X-Forwarded-For', `${forwardedForHeader}, ${ip}`);
    }
  }

  return request;
};
