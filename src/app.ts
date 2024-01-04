import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import createError from 'http-errors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import passport from './config/passport.js';
import { connectToMongo } from './db/mongo.js';
import { router } from './routes/index.js';
import { StatusCode } from './types/index.js';
import { sessionOptions } from './config/session.js';

const app = express();

app.use(helmet()); // Set security-related HTTP response headers
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookie header and populate req.cookies with an object keyed by the cookie names

app.use(session(sessionOptions)); // Connect to MongoDB for session storage

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(router);

// Error handling middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log('ERROR', error);

  if (error instanceof Error && error.message === 'Unauthenticated') {
    res.status(StatusCode.Unauthorized).send(createError(401, 'Unauthorized'));
  }

  if (error instanceof Error) {
    res
      .status(StatusCode.InternalServerError)
      .send(createError(500, error.message));
  }

  res.status(StatusCode.InternalServerError).send('Unknown error occurred.');
});

// Start server
app.listen(8080, () => {
  console.log('App listening on port 8080');
  connectToMongo();
});
