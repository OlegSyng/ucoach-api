import { Router } from 'express';
import { createInviteUser } from './createInviteUser.js';
import { createUserCoach } from './createUserCoach.js';
import { createUserTrainee } from './createUserTrainee.js';
import { deleteInviteUser } from './deleteInviteUser.js';
import { deleteUser } from './deleteUser.js';
import { getInviteUser } from './getInviteUser.js';
import { getInviteUsers } from './getInviteUsers.js';
import { getUser } from './getUser.js';
import { getUsers } from './getUsers.js';
import { updateInviteUser } from './updateInviteUser.js';
import { updateUser } from './updateUser.js';
import { routeGuardCoach } from '../../utils/routeGuard.js';

export const usersRouter = Router();

usersRouter.get('/', routeGuardCoach, getUsers);
usersRouter.post('/', createUserCoach);
usersRouter.post('/invite', routeGuardCoach, createInviteUser);
usersRouter.get('/invite/:traineeId', routeGuardCoach, getInviteUser);
usersRouter.get('/invite/:coachId', routeGuardCoach, getInviteUsers);
usersRouter.put('/invite/:traineeId', routeGuardCoach, updateInviteUser);
usersRouter.delete('/invite/:traineeId', routeGuardCoach, deleteInviteUser);
usersRouter.get('/:id', routeGuardCoach, getUser);
usersRouter.put('/:id', routeGuardCoach, updateUser);
usersRouter.delete('/:id', routeGuardCoach, deleteUser);
usersRouter.post('/:coachId', createUserTrainee);
