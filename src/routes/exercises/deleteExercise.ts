import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Exercise } from '../../db/models/exercise.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode, ResponseMessage, MessageCode } from '../../types/index.js';

type Params = { id: string };
type ResponseBody = ResponseMessage | HttpError<StatusCode.NotFound>;

export const deleteExercise = async (req: Request<Params>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const exercise = await db.collection<Exercise>(Collections.Exercises).findOneAndDelete({
      _id: new ObjectId(id),
      coachId: req.user?._id,
    });

    if (!exercise) {
      res.send(createError(StatusCode.NotFound, 'Exercise not found.'));
      return;
    }

    res.status(StatusCode.Success).json(new ResponseMessage(MessageCode.Success, 'Exercise deleted successfully.'));
  } catch (err) {
    next(err);
  }
};
