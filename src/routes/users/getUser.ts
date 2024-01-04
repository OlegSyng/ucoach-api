import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { User } from '../../db/models/user.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { id: string };

type ResponseBody = Omit<User, 'salt' | 'password_hash'> | HttpError<StatusCode.NotFound>;

export const getUser = async (req: Request<Params>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await db.collection<Partial<User>>(Collections.Users).findOne({ _id: new ObjectId(id) });

    if (!user) {
      res.send(createError(StatusCode.NotFound, `Could not find user with id ${id}.`));
      return;
    }

    delete user.salt;
    delete user.password_hash;

    res.status(200).json(user as ResponseBody);
  } catch (error) {
    next(error);
  }
};
