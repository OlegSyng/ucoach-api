import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Collections } from '../db/collections.js';
import { User } from '../db/models/user.model.js';
import { db } from '../db/mongo.js';

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true },
  async (req, username, password, cb) => {
    try {
      const user = await db.collection<User>(Collections.Users).findOne({ username });

      if (!user) return cb(null, false, { message: 'Invalid username provided. Please try again.'});

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) return cb(null, false, { message: 'Invalid password provided. Please try again.'});

      const userValue: Express.User = {
        username: user.username,
        isCoach: user.isCoach,
        coachId: user.coachId,
        _id: user._id.toString(),
      };

      return cb(null, userValue, { message: 'Successfully logged in.' });
    } catch (error) {
      return cb(error);
    }
  },
));

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user);
  })
});

passport.deserializeUser<Express.User>(async (user, cb) => {
  try {
    const result = await db.collection<User>(Collections.Users).findOne({ _id: new ObjectId(user._id) });
    if (!result) return cb(null, false);
    process.nextTick(() => {
      cb(null, user);
    });
  } catch (error) {
    cb(error);
  }
});

export default passport;