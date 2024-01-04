import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { Collections } from '../../db/collections.js';
import { Training } from '../../db/models/training.model.js';
import { db } from '../../db/mongo.js';
import { ListResponse, StatusCode, IParams } from '../../types/index.js';
import { assignCoachId } from '../../utils/assignCoachId.js';

// TODO: Add sorting of trainings

type ResponseBody = ListResponse<Training> | HttpError<StatusCode.NotFound>;

export const getTrainings = async (req: Request<IParams>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { page = '1', count = '10' } = req.query;

    const coachId = assignCoachId(req);

    const data = await db
      .collection(Collections.Trainings)
      .aggregate<ListResponse<Training>>([
        {
          $facet: {
            items: [
              { $match: { coachId: coachId } },
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
        { $sort: { title: 1 } },
      ])
      .toArray();

    const trainings = data[0];

    if (!trainings) {
      res.send(createError(StatusCode.NotFound, 'No trainings found.'));
      return;
    }

    res.status(StatusCode.Success).json(trainings);
  } catch (error) {
    next(error);
  }
};
