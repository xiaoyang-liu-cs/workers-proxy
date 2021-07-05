export type Middleware<T> = (
  context: T,
  next: () => Promise<void> | void,
) => Promise<void> | void;

export interface Pipeline<T> {
  push: (...middlewares: Middleware<T>[]) => void;
  execute: (context: T) => Promise<void>;
}

export interface Context {
  request: Request,
  response: Response,
  hostname: string,
}
