import { Pipeline, Middleware } from '../types/middleware';

const usePipeline = <Context>(
  ...initMiddlewares: Middleware<Context>[]
): Pipeline<Context> => {
  const stack: Middleware<Context>[] = [...initMiddlewares];

  const push: Pipeline<Context>['push'] = (
    ...middlewares: Middleware<Context>[]
  ) => {
    stack.push(...middlewares);
  };

  const execute: Pipeline<Context>['execute'] = async (context) => {
    const runner = async (
      prevIndex: number,
      index: number,
    ): Promise<void> => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times');
      }
      if (index >= stack.length) {
        return;
      }

      const middleware = stack[index];
      const next = () => runner(index, index + 1);
      await middleware(context, next);
    };

    await runner(-1, 0);
  };

  return {
    push,
    execute,
  };
};

export default usePipeline;
