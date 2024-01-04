import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../types/index.js';

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
    });
    res.status(StatusCode.Success).json({ message: 'Successfully logged out' });
  } catch (error) {
    next(error);
  }
};
