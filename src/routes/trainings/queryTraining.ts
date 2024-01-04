import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Training } from '../../db/models/training.model.js';
import { db } from '../../db/mongo.js';
import { IParams, IQueryCriteria, ListResponse, StatusCode } from '../../types/index.js';
import { assignCoachId } from '../../utils/assignCoachId.js';

// TODO: Add sorting of trainings

type RequestBody = IQueryCriteria<Exclude<keyof Training, '_id' | 'coachId'>>;
type ResponseBody = ListResponse<Training> | HttpError<StatusCode.NotFound>;

export const queryTraining = async (
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
      .collection<Training>(Collections.Trainings)
      .aggregate<ListResponse<Training>>([
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
            items: 1,
            totalCount: { $arrayElemAt: ['$totalCount.totalCount', 0] },
          },
        },
        { $sort: { title: 1 } }, // TODO: Add sorting of trainings
      ])
      .toArray();

    const trainings = data[0];

    if (!trainings) {
      res.send(createError(StatusCode.NotFound, 'Could not find trainings.'));
      return;
    }

    res.status(StatusCode.Success).send(trainings);
  } catch (error) {
    next(error);
  }
};
