import { Router } from "express";
import { createTraining } from "./createTraining.js";
import { getTrainings } from "./getTrainings.js";
import { getTraining } from "./getTraining.js";
import { updateTraining } from "./updateTraining.js";
import { deleteTraining } from "./deleteTraining.js";
import { queryTraining } from "./queryTraining.js";
import { routeGuard, routeGuardCoach } from "../../utils/routeGuard.js";

export const trainingsRouter = Router();

trainingsRouter.post('/', routeGuardCoach, createTraining)
trainingsRouter.get('/', routeGuard, getTrainings)
trainingsRouter.post('/query', routeGuard, queryTraining)
trainingsRouter.get('/:id', routeGuard, getTraining)
trainingsRouter.put('/:id', routeGuardCoach, updateTraining)
trainingsRouter.delete('/:id', routeGuardCoach, deleteTraining)