import { Request } from "express";
import { Nullable } from "../types/index.js";

export const assignCoachId = (req: Request<unknown>): Nullable<string> => {
    if (req.user && req.user.isCoach) return req.user._id;
    if (req.user && !req.user.isCoach) return req.user.coachId;
    return null;
}