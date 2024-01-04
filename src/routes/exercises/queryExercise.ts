import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Exercise } from '../../db/models/exercise.model.js';
import { db } from '../../db/mongo.js';
import { ListResponse, StatusCode, IQueryCriteria, IParams, Nullable } from '../../types/index.js';
import { assignCoachId } from '../../utils/assignCoachId.js';

type RequestBody = IQueryCriteria<Exclude<keyof Exercise, '_id' | 'coachId'>>;
type ResponseBody = ListResponse<Exercise> | HttpError<StatusCode.NotFound>;

export const queryExercise = async (
  req: Request<IParams, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
  next: NextFunction,
) => {
  try {
    const { page = '1', count = '10' } = req.query;
    const { operator, criterias } = req.body;

    const coachId = assignCoachId(req);

    const query = criterias.map(({ field, value, operator }) => {
      return { [field]: { [operator]: value } };
    });

    const data = await db
      .collection<Exercise>(Collections.Exercises)
      .aggregate<ListResponse<Exercise>>([
        {
          $facet: {
            items: [
              {
                $match: {
                  [operator]: query,
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

    res.status(StatusCode.Success).send(exercises);
  } catch (err) {
    next(err);
  }
};
