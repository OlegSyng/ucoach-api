import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Training } from '../../db/models/training.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode, ResponseMessage, MessageCode } from '../../types/index.js';

type RequestBody = Omit<Training, '_id'>;
type ResponseBody = ResponseMessage | HttpError<StatusCode.InternalServerError>;

export const createTraining = async (
  req: Request<unknown, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const result = await db.collection<Training>(Collections.Trainings).insertOne({ ...req.body });

    if (!result.acknowledged) {
      res.send(createError(StatusCode.InternalServerError, 'Training could not be created'));
      return;
    }

    res
      .status(StatusCode.Created)
      .send(new ResponseMessage(MessageCode.Success, 'Training created', result.insertedId.toString()));
  } catch (err) {
    next(err);
  }
};
