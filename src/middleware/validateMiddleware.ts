import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validate =
  (schema: ZodObject<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: error.issues.map(e => ({
            path: e.path[1] || e.path[0],
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };
