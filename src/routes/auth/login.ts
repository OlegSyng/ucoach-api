import type { Request, Response, NextFunction } from 'express';
import passport from '../../config/passport.js';
import { MessageCode, StatusCode } from '../../types/index.js';

type Info = { message: string };

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: unknown, user: any, info: Info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(StatusCode.Unauthorized).json({
        code: MessageCode.Failure,
        message: info.message,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(StatusCode.Success).json({
        code: MessageCode.Success,
        message: info.message,
      });
    });
  })(req, res, next);
};
