import type { Application } from 'express';
import request from 'supertest';

import { Server } from '@/server';

type Headers = {
  authorization?: string;
};

type Config = {
  headers?: Headers;
};

type RequestOptions = {
  headers?: Headers;
};

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type ResponseBody<D = unknown> = {
  data?: D;
  message?: string;
  errorCode?: string;
};

export type TestResponse<D = unknown> = {
  statusCode: number;
  body: ResponseBody<D>;
};

export class TestServer {
  private readonly server = new Server();
  private app!: Application;

  private constructor(private readonly config: Config = {}) {}

  static async create(config: Config = {}): Promise<TestServer> {
    const testServer = new TestServer(config);

    await testServer.server.init();
    testServer.app = testServer.server.getApp();

    return testServer;
  }

  post<D = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<D>('post', path, body, options);
  }

  get<D = unknown>(path: string, options?: RequestOptions) {
    return this.request<D>('get', path, undefined, options);
  }

  put<D = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<D>('put', path, body, options);
  }

  patch<D = unknown>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<D>('patch', path, body, options);
  }

  delete<D = unknown>(path: string, options?: RequestOptions) {
    return this.request<D>('delete', path, undefined, options);
  }

  private async request<D>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<TestResponse<D>> {
    const req = request(this.app)[method](path);

    const authorization =
      options?.headers?.authorization ?? this.config.headers?.authorization;

    if (authorization) req.set('Authorization', authorization);

    if (body !== undefined) req.send(body as string | object);

    const res = await req;

    return {
      statusCode: res.statusCode,
      body: res.body as ResponseBody<D>
    };
  }
}
