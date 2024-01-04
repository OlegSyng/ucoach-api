import { NextFunction, Request, Response } from 'express';
import { MessageCode, ResponseMessage, StatusCode } from '../types/index.js';

export const routeGuard = (req: Request<unknown>, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(StatusCode.Unauthorized)
      .json(new ResponseMessage(MessageCode.Failure, 'You are not logged in.'));
  }
};

export const routeGuardCoach = (req: Request<unknown>, res: Response, next: NextFunction) => {
  if(req.isAuthenticated() && req.user.isCoach) {
    next();
  } else {  
    res
      .status(StatusCode.Forbidden)
      .json(new ResponseMessage(MessageCode.Failure, 'You do not have access to this resource.'));
  }
}
