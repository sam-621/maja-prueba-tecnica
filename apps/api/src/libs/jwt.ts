import jsonwebtoken from 'jsonwebtoken';

import { config } from '@/config';
import { logger } from '@/logger';

class JWT {
  generate<TPayload extends object>(payload: TPayload): string {
    return jsonwebtoken.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  verify<TPayload>(token: string): TPayload | null {
    try {
      return jsonwebtoken.verify(token, config.jwt.secret) as TPayload;
    } catch (error) {
      logger.error('failed to verify jsonwebtoken', error);
      return null;
    }
  }

  decode<TPayload>(token: string): TPayload | null {
    try {
      return jsonwebtoken.decode(token) as TPayload;
    } catch (error) {
      logger.error('failed to decode jsonwebtoken', error);
      return null;
    }
  }
}

export const jwt = new JWT();
