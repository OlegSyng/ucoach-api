import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Trainee } from '../../db/models/trainee.model.js';
import { User } from '../../db/models/user.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode, ResponseMessage, MessageCode } from '../../types/index.js';

type Params = { coachId: string };
type RequestBody = Pick<User, 'username' | 'email' | 'firstName' | 'lastName'> & { password: string };
type ResponseBody = ResponseMessage | HttpError<StatusCode.BadRequest | StatusCode.NotFound>;

export const createUserTrainee = async (
  req: Request<Params, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { coachId } = req.params;
    const { username, email, password, firstName, lastName } = req.body;

    const trainee = await db.collection<Trainee>(Collections.Trainees).findOne({ coachId, email });

    if (!trainee) {
      res.send(createError(StatusCode.NotFound, `Trainee with provided email (${email}) not found.`));
      return;
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = new User(
      username,
      email,
      salt,
      password_hash,
      firstName,
      lastName,
      false, //register as trainee by default e.g isCoach = false
      coachId,
    );

    const result = await db.collection<User>(Collections.Users).insertOne(user);

    if (!result.acknowledged) {
      res.send(createError(StatusCode.BadRequest, 'Could not register trainee.'));
      return;
    }

    // Update trainee with userId
    const updatedTraineeResult = await db.collection<Trainee>(Collections.Trainees).updateOne(
      { coachId: coachId, email: email },
      { $set: { userId: result.insertedId.toString() } },
    );

    if (updatedTraineeResult.modifiedCount === 0) {
      res.send(createError(StatusCode.NotFound, `Could not update trainee with provided email (${email}).`));
      return;
    }

    const response = new ResponseMessage(
      MessageCode.Success,
      'Trainee registered successfully.',
      result.insertedId.toString(),
    );

    res.status(StatusCode.Created).json(response);
  } catch (error) {
    next(error);
  }
};
