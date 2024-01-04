import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Trainee } from '../../db/models/trainee.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { traineeId: string };
type ResponseBody = Trainee | HttpError<StatusCode.NotFound>;

export const getInviteUser = async (req: Request<Params>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { traineeId } = req.params;

    const result = await db.collection<Trainee>(Collections.Trainees).findOne({ _id: new ObjectId(traineeId) });

    if (!result) {
      res.send(createError(StatusCode.NotFound, 'User with provided id not found'));
      return;
    }

    res.status(StatusCode.Success).json(result);
  } catch (error) {
    next(error);
  }
};
