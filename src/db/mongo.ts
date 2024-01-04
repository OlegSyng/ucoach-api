import { MongoClient, ServerApiVersion } from 'mongodb';
import { Collections } from './collections.js';
import { usersCollectionValidation } from './models/user.model.js';
import { traineesCollectionValidation } from './models/trainee.model.js';
import { excercisesCollectionValidation } from './models/exercise.model.js';
import { trainingsCollectionValidation } from './models/training.model.js';

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db = client.db(dbName);

export const connectToMongo = async () => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. Connected to MongoDB 🛢️ !');

    // Create collections and set validation
    // db.createCollection(Collections.Users, usersCollectionValidation);
    // db.createCollection(Collections.Trainees, traineesCollectionValidation)
    // db.createCollection(Collections.Exercises, excercisesCollectionValidation);
    // db.createCollection(Collections.Trainings, trainingsCollectionValidation);

    // Update validation on existing collections
    // db.command(usersCollectionValidation)
    // db.command(traineesCollectionValidation)
    // db.command(excercisesCollectionValidation)
  } catch (err) {
    console.log(`There was an error connecting to MongoDB: ${err}`);
    // Ensures that the client will close when error occurs
    await client.close();
  }
};
