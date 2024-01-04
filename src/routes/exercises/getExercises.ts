import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Exercise } from '../../db/models/exercise.model.js';
import { db } from '../../db/mongo.js';
import { ListResponse, Nullable, StatusCode, IParams } from '../../types/index.js';
import { assignCoachId } from '../../utils/assignCoachId.js';

// TODO: Add sorting of exercises

type CoachId = Nullable<string>;
type ResponseBody = ListResponse<Exercise> | HttpError<StatusCode.NotFound>;

export const getExercises = async (req: Request<IParams>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { page = '1', count = '10' } = req.query;

    const coachId = assignCoachId(req);

    const data = await db
      .collection(Collections.Exercises)
      .aggregate<ListResponse<Exercise>>([
        {
          $facet: {
            items: [
              {
                $match: {
                  coachId: coachId,
                },
              },
              { $skip: (Number(page) - 1) * Number(count) },
              { $limit: Number(count) },
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
        { $sort: { title: 1 } }, // TODO: Add sorting of exercises
      ])
      .toArray();

    const exercises = data[0];

    if (!exercises) {
      res.send(createError(StatusCode.NotFound, 'Could not find exercises.'));
      return;
    }

    res.status(StatusCode.Success).json(exercises);
  } catch (err) {
    next(err);
  }
};
