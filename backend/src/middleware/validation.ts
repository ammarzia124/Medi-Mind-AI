import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema?: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema) {
      return next();
    }

    try {
      // Validate request body
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
