import { jwtPayload } from "../../middlewares.ts/authMiddleware";


declare global {
  namespace Express {
    interface Request {
      user?: jwtPayload;
    }
  }
}

export {};
