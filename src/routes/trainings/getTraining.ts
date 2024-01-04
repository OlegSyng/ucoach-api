import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Training } from '../../db/models/training.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { id: string };
type ResponseBody = Training | HttpError<StatusCode.NotFound>;

export const getTraining = async (req: Request<Params>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const training = await db.collection<Training>(Collections.Trainings).findOne({ _id: new ObjectId(id) });

    if (!training) {
      res.send(createError(StatusCode.NotFound, 'Training not found.'));
      return;
    }

    res.status(StatusCode.Success).send(training);
  } catch (err) {
    next(err);
  }
};
