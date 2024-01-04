import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Exercise } from '../../db/models/exercise.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { id: string };
type RequestBody = Omit<Exercise, '_id'>;
type ResponseBody = Exercise | HttpError<StatusCode.Forbidden | StatusCode.NotFound>;

export const updateExercise = async (
  req: Request<Params, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description, coachId, intensity, videoUrl, equipment } = req.body;

    if (req.user && req.user.isCoach && req.user._id !== coachId) {
      res.send(createError(StatusCode.Forbidden, 'You are not allowed to update this exercise'));
      return;
    }

    const exercise = await db.collection<Exercise>(Collections.Exercises).findOneAndUpdate(
      { _id: new ObjectId(id), coachId: req.user?._id },
      {
        $set: {
          title,
          description,
          intensity,
          videoUrl,
          equipment,
        },
      },
      { returnDocument: 'after' },
    );

    if (!exercise) {
      res.send(createError(StatusCode.NotFound, 'Exercise not found.'));
      return;
    }

    res.status(StatusCode.Success).json(exercise);
  } catch (err) {
    next(err);
  }
};
