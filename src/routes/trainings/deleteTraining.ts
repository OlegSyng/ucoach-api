import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { Training } from '../../db/models/training.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode, ResponseMessage, MessageCode } from '../../types/index.js';
import { assignCoachId } from '../../utils/assignCoachId.js';

type Params = { id: string };
type ResponseBody = ResponseMessage | HttpError<StatusCode.NotFound>;

export const deleteTraining = async (req: Request<Params>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const coachId = assignCoachId(req);

    const training = await db
      .collection<Training>(Collections.Trainings)
      .findOneAndDelete({ _id: new ObjectId(id), coachId: coachId });

    if (!training) {
      res.send(createError(StatusCode.NotFound, 'Training not found.'));
      return;
    }

    res.status(StatusCode.Success).json(new ResponseMessage(MessageCode.Success, 'Training deleted successfully'));
  } catch (error) {
    next(error);
  }
};
