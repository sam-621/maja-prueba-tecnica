import { DataSource } from 'typeorm';

import { config } from '@/config';

import { logger } from '../logger/logger';

import { Blog, Category, Comment, User } from './entities';

const isTest = config.env === 'test';

export const dataSource = new DataSource({
  type: 'postgres',
  url: config.dbUrl,
  entities: [User, Blog, Category, Comment],
  synchronize: true,
  dropSchema: isTest,
  logging: isTest ? false : ['error', 'warn']
});

export const initDataSource = async (): Promise<DataSource> => {
  if (dataSource.isInitialized) return dataSource;

  try {
    await dataSource.initialize();
    logger.info('Database connected');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }

  return dataSource;
};
