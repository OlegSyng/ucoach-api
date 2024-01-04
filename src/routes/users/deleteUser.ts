import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { ObjectId } from 'mongodb';
import { Collections } from '../../db/collections.js';
import { User } from '../../db/models/user.model.js';
import { db } from '../../db/mongo.js';
import { StatusCode, ResponseMessage, MessageCode } from '../../types/index.js';

type Params = { id: string };
type ResponseBody = ResponseMessage | HttpError<StatusCode.BadRequest | StatusCode.NotFound>;

export const deleteUser = async (req: Request<Params>, res: Response<ResponseBody>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deletedUser = await db.collection<User>(Collections.Users).findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedUser) {
      res.send(createError(StatusCode.BadRequest, `Could not delete user with id ${id}.`));
      return;
    }

    if (!deletedUser.isCoach) {
      const deletedUserTrainee = await db.collection(Collections.Trainees).findOneAndDelete({ userId: id });

      if (!deletedUserTrainee) {
        res.send(createError(StatusCode.BadRequest, `Could not delete trainee with id ${id}.`));
        return;
      }
    }

    const response = new ResponseMessage(MessageCode.Success, `User with id ${id} deleted successfully.`);

    res.status(StatusCode.Success).json(response);
  } catch (error) {}
};
