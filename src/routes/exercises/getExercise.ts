import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Exercise } from '../../db/models/exercise.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { id: string };
type ResponseBody = Exercise | HttpError<StatusCode.NotFound | StatusCode.Unauthorized>;

export const getExercise = async (req: Request<Params>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const exercise = await db.collection<Exercise>(Collections.Exercises).findOne({ _id: new ObjectId(id) });

    if (!exercise) {
      res.send(createError(StatusCode.NotFound, 'Exercise not found.'));
      return;
    }

    if (req.user?.coachId !== exercise.coachId || req.user?._id !== exercise.coachId) {
      res.send(createError(StatusCode.Unauthorized, 'You are not authorized to view this exercise.'));
      return;
    }

    res.status(StatusCode.Success).send(exercise);
  } catch (err) {
    next(err);
  }
};
