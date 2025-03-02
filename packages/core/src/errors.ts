export interface AppError extends Error {
  message: string;
  stack?: string;
  type?: string;
  ctx?: any;
  toJson(): {
    message: string;
    stack?: string;
    type?: string;
    ctx?: any;
  };
}

export function createAppErr(args: {
  message: string;
  stack?: any;
  type?: string;
  ctx?: any;
  originalError?: Error;
}): AppError {
  const err = new Error(args.message) as AppError;
  if (args.originalError) {
    err.stack = args.originalError.stack;
  }
  if (err.type) err.type = args.type;
  if (err.ctx) err.ctx = args.ctx;

  err.toJson = function toJson() {
    return {
      message: err.message,
      ...(err.ctx !== undefined && { ctx: this.ctx }),
      ...(err.stack !== undefined && { stack: this.stack }),
      ...(err.type !== undefined && { type: this.type }),
    };
  };

  return err;
}
