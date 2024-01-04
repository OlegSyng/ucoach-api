import { Request, Response, NextFunction } from 'express';
import { Collections } from '../../db/collections.js';
import { Trainee } from '../../db/models/trainee.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode } from '../../types/index.js';

type Params = { coachId: string };

export const getInviteUsers = async (req: Request<Params>, res: Response, next: NextFunction) => {
  try {
    const { coachId } = req.params;

    const result = await db.collection<Trainee>(Collections.Trainees).find({ coachId: coachId }).toArray();

    res.status(StatusCode.Success).json(result);
  } catch (error) {
    next(error);
  }
};
