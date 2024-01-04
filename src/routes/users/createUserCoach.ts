import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { User } from '../../db/models/user.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode, ResponseMessage, MessageCode } from '../../types/index.js';

type ResponseBody = ResponseMessage;
type RequestBody = Pick<User, 'username' | 'email' | 'firstName' | 'lastName'> & { password: string };

export const createUserCoach = async (
  req: Request<unknown, ResponseBody, RequestBody>,
  res: Response<ResponseBody | HttpError<StatusCode.BadRequest>>,
  next: NextFunction,
) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

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
      true, //register as coach by default
    );

    const result = await db.collection<User>(Collections.Users).insertOne(user);

    if (!result.acknowledged) {
      res.send(createError(StatusCode.BadRequest, 'Could not register coach.'));
      return;
    }

    const response = new ResponseMessage(
      MessageCode.Success,
      'Coach registered successfully.',
      result.insertedId.toString(),
    );

    res.status(StatusCode.Created).json(response);
  } catch (error) {
    next(error);
  }
};
