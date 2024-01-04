import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Trainee } from '../../db/models/trainee.model.js';
import { db } from '../../db/mongo.js';
import { ResponseMessage, StatusCode, MessageCode } from '../../types/index.js';

type Params = { traineeId: string };
type ResponseBody = ResponseMessage | HttpError<StatusCode.NotFound | StatusCode.BadRequest>;

export const deleteInviteUser = async (
  req: Request<Params, ResponseBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { traineeId } = req.params;

    const trainee = await db.collection<Trainee>(Collections.Trainees).findOne({ _id: new ObjectId(traineeId) });

    if (!trainee) {
      res.send(createError(StatusCode.NotFound, 'Trainee with provided id not found'));
      return;
    }

    if (trainee.userId) {
      res.send(createError(StatusCode.BadRequest, 'Trainee already registered. Cannot delete.'));
      return;
    }

    const result = await db.collection<Trainee>(Collections.Trainees).deleteOne({ _id: new ObjectId(traineeId) });

    if (!result.acknowledged) {
      res.send(createError(StatusCode.BadRequest, 'Could not delete trainee.'));
      return;
    }

    const resMessage = new ResponseMessage(MessageCode.Success, 'User deleted successfully');

    res.status(StatusCode.Success).json(resMessage);
  } catch (error) {
    next(error);
  }
};
