import { Router } from 'express';
import { loginUser } from './login.js';
import { logoutUser } from './logout.js';

export const authRoutes = Router();

authRoutes.post('/login', loginUser);
authRoutes.get('/logout', logoutUser);