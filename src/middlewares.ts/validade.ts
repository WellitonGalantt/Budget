import { NextFunction, Response, Request } from "express";
import { z } from "zod";

type RequestSchema = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export const validate = (schemas: RequestSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as any;
      }

      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as any;
      }

      if (schemas.body) {
        req.body = (await schemas.body.parseAsync(req.body)) as any;
      }

      return next();
    } catch (error) {
      // O next passando um dados, é automaticamente considerado um erro e cai no handler global de erro
      next(error);
    }
  };
};
