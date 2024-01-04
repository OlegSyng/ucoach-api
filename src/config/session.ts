import connectMongo from 'connect-mongo';
import { SessionOptions } from 'express-session';

export const sessionOptions: SessionOptions = {
  name: 'session-ucoach',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, 
  store: connectMongo.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB_NAME,
    ttl: 1 * 60 * 60, // time to live in seconds (1 hour)
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 1, // 1 hour
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
};
