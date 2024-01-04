import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Training } from '../../db/models/training.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';
import { assignCoachId } from '../../utils/assignCoachId.js';

type Params = { id: string };
type RequestBody = Omit<Training, '_id' | 'coachId'>;
type ResponseBody = Training | HttpError<StatusCode.NotFound>;

export const updateTraining = async (
  req: Request<Params, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const coachId = assignCoachId(req);

    const training = await db
      .collection<Training>(Collections.Trainings)
      .findOneAndUpdate(
        { _id: new ObjectId(id), coachId: coachId },
        { $set: { ...req.body } },
        { returnDocument: 'after' },
      );

    if (!training) {
      res.send(createError(StatusCode.NotFound, 'Training not found.'));
      return;
    }

    res.status(StatusCode.Success).json(training);
  } catch (error) {
    next(error);
  }
};
