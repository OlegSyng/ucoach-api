import { Router } from 'express';
import { createExercise } from './createExercise.js';
import { getExercise } from './getExercise.js';
import { getExercises } from './getExercises.js';
import { updateExercise } from './updateExercise.js';
import { deleteExercise } from './deleteExercise.js';
import { queryExercise } from './queryExercise.js';
import { routeGuard, routeGuardCoach } from '../../utils/routeGuard.js';

export const exercisesRouter = Router();

exercisesRouter.post('/', routeGuardCoach, createExercise);
exercisesRouter.get('/', routeGuard, getExercises);
exercisesRouter.post('/query', routeGuard, queryExercise)
exercisesRouter.get('/:id', routeGuard, getExercise);
exercisesRouter.put('/:id', routeGuardCoach, updateExercise);
exercisesRouter.delete('/:id', routeGuardCoach, deleteExercise);
