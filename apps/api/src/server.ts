import 'reflect-metadata';

import type { Application } from 'express';
import express from 'express';

import { requestContextMiddleware } from './api/request-context';
import { initDataSource } from './persistence/data-source';
import { config } from './config';
import { logger } from './logger';

export class Server {
  private readonly app: Application;

  constructor() {
    this.app = express();
  }

  async init() {
    const dataSource = await initDataSource();

    this.app.use(requestContextMiddleware(dataSource));
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
