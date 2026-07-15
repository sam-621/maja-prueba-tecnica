import winston from 'winston';

export const inlineLoggerFormat = [
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...rest }) => {
    if (rest.error) {
      return `${timestamp} ${level}: ${(rest.error as any).stack}`;
    }
    return `${timestamp} ${level}: ${message}`;
  })
];
