import { Middleware } from '../types/middleware';

export const useWebSocket: Middleware = (
  context,
  next,
) => {
  const { response } = context;
  if (
    response.status === 101
    && response.headers.get('upgrade') === 'websocket'
  ) {
    return null;
  }

  return next();
};
