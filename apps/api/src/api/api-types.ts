import type { NextFunction, Request, Response } from 'express';

export type Endpoint = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;
