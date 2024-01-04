import { Router } from "express";
import { authRoutes } from "./auth/index.js";
import { usersRouter } from "./users/index.js";
import { exercisesRouter } from "./exercises/index.js";
import { trainingsRouter } from "./trainings/index.js";

export const router = Router();

router.use('/auth', authRoutes)
router.use('/users', usersRouter)
router.use('/exercises', exercisesRouter)
router.use('/trainings', trainingsRouter)