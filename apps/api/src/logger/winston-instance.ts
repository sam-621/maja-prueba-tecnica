import winston from 'winston';
import { config } from '../config';
import { inlineLoggerFormat } from './logger-format';

export const winstonInstance = winston.createLogger({
  level: 'info',
  silent: config.env === 'test',
  format: winston.format.combine(...inlineLoggerFormat),
  transports: [new winston.transports.Console()]
});
