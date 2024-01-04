import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Trainee } from '../../db/models/trainee.model.js';
import { db } from '../../db/mongo.js';
import { ResponseMessage, StatusCode, MessageCode } from '../../types/index.js';

type RequestBody = Omit<Trainee, 'userId' | '_id'>;
type ResponseBody = ResponseMessage | HttpError<StatusCode.BadRequest | StatusCode.NotFound>;

export const createInviteUser = async (
  req: Request<unknown, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {    
    const { firstName, lastName, email, coachId } = req.body;

    const result = await db
      .collection<Trainee>(Collections.Trainees)
      .insertOne(new Trainee(firstName, lastName, email, coachId));

    if (!result.acknowledged) {
      res.send(createError(StatusCode.BadRequest, 'Could not create user'));
      return;
    }

    const response = new ResponseMessage(
      MessageCode.Success,
      'Trainee created successfully.',
      result.insertedId.toString(),
    );

    res.status(StatusCode.Created).json(response);
  } catch (error) {
    next(error);
  }
};
