import 'reflect-metadata';

import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import helmet from 'helmet';

import { requestContextMiddleware } from './api/request-context';
import { AuthRouter } from './api/routers/auth';
import { BlogRouter } from './api/routers/blog';
import { CategoryRouter } from './api/routers/category';
import { CommentRouter } from './api/routers/comment';
import { ProfileRouter } from './api/routers/profile';
import { initDataSource } from './persistence/data-source';
import { seedCategories } from './persistence/seed';
import { config } from './config';
import { logger } from './logger';

export class Server {
  private readonly app: Application;

  constructor() {
    this.app = express();
  }

  async init() {
    const dataSource = await initDataSource();
    await seedCategories(dataSource);

    this.app.use(helmet());
    this.app.use(cors({ origin: config.cors, credentials: true }));
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(requestContextMiddleware(dataSource));

    const authRouter = new AuthRouter();
    const profileRouter = new ProfileRouter();
    const blogRouter = new BlogRouter();
    const commentRouter = new CommentRouter();
    const categoryRouter = new CategoryRouter();

    this.app.use(authRouter.router);
    this.app.use(profileRouter.router);
    this.app.use(blogRouter.router);
    this.app.use(commentRouter.router);
    this.app.use(categoryRouter.router);
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
