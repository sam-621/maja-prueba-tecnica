import { winstonInstance } from './winston-instance';

export class Logger {
  info(message: string, metadata?: Record<string, unknown>): void {
    winstonInstance.info(message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    winstonInstance.warn(message, metadata);
  }

  error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    winstonInstance.error(message, {
      ...meta,
      error: this.formatError(error)
    });
  }

  private formatError(error: unknown | undefined) {
    if (error instanceof Error) {
      return {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack
      };
    }

    return undefined;
  }
}

export const logger = new Logger();
