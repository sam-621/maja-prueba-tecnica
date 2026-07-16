import 'reflect-metadata';

import type { Application } from 'express';
import express from 'express';

import { config } from './config';
import { logger } from './logger';

export class Server {
  private readonly app: Application;

  constructor() {
    this.app = express();
  }

  getApp() {
    return this.app;
  }

  start() {
    this.app.listen(config.port, () => {
      logger.info(`running on port ${config.port}`);
    });
  }
}
