import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { User } from '../../db/models/user.model.js';
import { db } from '../../db/mongo.js';
import { ListResponse, StatusCode } from '../../types/index.js';

type IUser = Omit<User, 'salt' | 'password_hash'>;
type ResponseBody = ListResponse<IUser> | HttpError<StatusCode.NotFound>;

export const getUsers = async (req: Request, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const data = await db
      .collection<User>(Collections.Users)
      .aggregate<ListResponse<IUser>>([
        {
          $facet: {
            items: [
              {
                $project: {
                  salt: 0, // Exclude the 'salt' field from the query
                  password_hash: 0, // Exclude the 'password_hash' field from the query
                },
              },
            ],
            totalCount: [
              {
                $group: {
                  _id: null,
                  totalCount: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalCount: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            items: '$items',
            totalCount: { $arrayElemAt: ['$totalCount.totalCount', 0] },
          },
        },
      ])
      .toArray();

    const users = data[0];

    if (!users) {
      res.send(createError(StatusCode.NotFound, 'Could not find users.'));
      return;
    }

    res.status(StatusCode.Success).json(users);
  } catch (error) {
    next(error);
  }
};
