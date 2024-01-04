import fs from 'fs';
import sdk, { ItemGroup, Item } from 'postman-collection';

// ***********************************************************************************
//          GENERAL
// ***********************************************************************************

const collection = new sdk.Collection({
  info: {
    name: 'UCoach API',
  },
  item: [],
});

const apiEndpoint = '{{serverUrl}}';
const queryParams = '?page=1&count=10&sort=title:asc';

// ***********************************************************************************
//          AUTH FOLDER
// ***********************************************************************************
const authFolder: ItemGroup<Item> = new sdk.ItemGroup({ name: 'Auth' });

const login = new sdk.Item({
  name: 'Login',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    url: apiEndpoint + '/auth/login',
    method: 'POST',
    body: {
      mode: 'raw',
      raw: JSON.stringify({ username: 'OlegSyng', password: 'olegsyng1234' }),
    },
  },
});

const logout = new sdk.Item({
  name: 'Logout',
  request: {
    method: 'GET',
    url: apiEndpoint + '/auth/logout',
  },
});

authFolder.items.add(login);
authFolder.items.add(logout);

// ***********************************************************************************
//          USER FOLDER
// ***********************************************************************************
const usersFolder: ItemGroup<Item> = new sdk.ItemGroup({ name: 'Users' });

const getUsers = new sdk.Item({
  name: 'Get Users',
  request: {
    method: 'GET',
    url: apiEndpoint + '/users',
  },
});

const getUser = new sdk.Item({
  name: 'Get User',
  request: {
    method: 'GET',
    url: apiEndpoint + '/users/{{userId}}',
  },
});

const createUserCoach = new sdk.Item({
  name: 'Create User Coach',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'POST',
    url: apiEndpoint + '/users',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        username: 'OlegSyng',
        password: 'olegsyng1234',
        email: 'olegsingaevskii9@gmail.com',
        firstName: 'Oleg',
        lastName: 'Syngaivskyi',
      }),
    },
  },
});

const createUserTrainee = new sdk.Item({
  name: 'Create User Trainee',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'POST',
    url: apiEndpoint + '/users/{{coachId}}',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        username: 'AlenaSyng',
        email: 'alena.syngaivska@gmail.com',
        firstName: 'Alena',
        lastName: 'Syngaivska',
        password: 'alenasyn1234',
      }),
    },
  },
});

const updateUser = new sdk.Item({
  name: 'Update User',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'PUT',
    url: apiEndpoint + '/users/{{userId}}',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        username: 'OlegSyng',
        email: 'olegsingaevskii9@gmail.com',
        firstName: 'Oleg',
        lastName: 'Syngaivskyi',
        dateOfBirth: '1998-09-09',
        imageUrl: 'https://i.imgur.com/7VZ7ZzC.jpeg',
      }),
    },
  },
});

const deleteUser = new sdk.Item({
  name: 'Delete User',
  request: {
    method: 'DELETE',
    url: apiEndpoint + '/users/{{userId}}',
  },
});

const createInviteUser = new sdk.Item({
  name: 'Create Invite User',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'POST',
    url: apiEndpoint + '/users/invite',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        firstName: 'Alena',
        lastName: 'Syngaivska',
        email: 'alena.syngaivska@gmail.com',
        coachId: '{{coachId}}',
      }),
    },
  },
});

const getInviteUser = new sdk.Item({
  name: 'Get Invite User',
  request: {
    method: 'GET',
    url: apiEndpoint + '/users/invite/{{inviteId}}',
  },
});

const getInviteUsers = new sdk.Item({
  name: 'Get Invite Users',
  request: {
    method: 'GET',
    url: apiEndpoint + '/users/invite/{{coachId}}',
  },
});

const updateInviteUser = new sdk.Item({
  name: 'Update Invite User',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'PUT',
    url: apiEndpoint + '/users/invite/{{inviteId}}',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        firstName: 'Alena',
        lastName: 'Syngaivska',
        email: 'alena.syngaivska@gmail.com',
      }),
    },
  },
});

const deleteInviteUser = new sdk.Item({
  name: 'Delete Invite User',
  request: {
    method: 'DELETE',
    url: apiEndpoint + '/users/invite/{{inviteId}}',
  },
});

usersFolder.items.add(getUsers);
usersFolder.items.add(getUser);
usersFolder.items.add(createUserCoach);
usersFolder.items.add(createUserTrainee);
usersFolder.items.add(updateUser);
usersFolder.items.add(deleteUser);
usersFolder.items.add(createInviteUser);
usersFolder.items.add(getInviteUser);
usersFolder.items.add(getInviteUsers);
usersFolder.items.add(updateInviteUser);
usersFolder.items.add(deleteInviteUser);

// ***********************************************************************************
//          EXERCISES FOLDER
// ***********************************************************************************
const exercisesFolder: ItemGroup<Item> = new sdk.ItemGroup({ name: 'Exercises' });

const createExercise = new sdk.Item({
  name: 'Create Exercise',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'POST',
    url: apiEndpoint + '/exercises',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        title: 'Push Up',
        description: 'Push up exercise',
        coachId: '{{coachId}}',
        intensity: 5,
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        equipment: null,
      }),
    },
  },
});

const getExercises = new sdk.Item({
  name: 'Get Exercises',
  request: {
    method: 'GET',
    url: apiEndpoint + '/exercises' + queryParams,
  },
});

const getExercise = new sdk.Item({
  name: 'Get Exercise',
  request: {
    method: 'GET',
    url: apiEndpoint + '/exercises/{{exerciseId}}',
  },
});

const updateExercise = new sdk.Item({
  name: 'Update Exercise',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'PUT',
    url: apiEndpoint + '/exercises/{{exerciseId}}',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        title: 'Push Up',
        description: 'Push up exercise',
        coachId: '{{coachId}}',
        intensity: 6,
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        equipment: null,
      }),
    },
  },
});

const deleteExercise = new sdk.Item({
  name: 'Delete Exercise',
  request: {
    method: 'DELETE',
    url: apiEndpoint + '/exercises/{{exerciseId}}',
  },
});

const queryExercise = new sdk.Item({
  name: 'Query Exercise',
  request: {
    method: 'POST',
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    url: apiEndpoint + '/exercises/query' + queryParams,
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        operator: '$and',
        criteria: [
          {
            operator: '$eq',
            field: 'title',
            value: 'Push^',
          },
          {
            operator: '$eq',
            field: 'intensity',
            value: '5',
          },
        ],
      }),
    },
  },
});

exercisesFolder.items.add(createExercise);
exercisesFolder.items.add(getExercises);
exercisesFolder.items.add(getExercise);
exercisesFolder.items.add(updateExercise);
exercisesFolder.items.add(deleteExercise);
exercisesFolder.items.add(queryExercise);

// ***********************************************************************************
//          TRAININGS FOLDER
// ***********************************************************************************
const trainingsFolder: ItemGroup<Item> = new sdk.ItemGroup({ name: 'Trainings' });

const createTraining = new sdk.Item({
  name: 'Create Training',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'POST',
    url: apiEndpoint + '/trainings',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        title: 'Savage Shred W1D1',
        description:
          'Part 1: METCON (Circuit of 4 rounds) Keep intensity at 75-80%., you should feel challanged, but not going all out. Take kettlebell weight that coincides with your fitness level. Adjust your rest, if necessary.',
        coachId: '{{coachId}}',
        intensity: 5,
        equipment: null,
        program: [{
          title: 'Part 1: METCON',
          rounds: 4,
          activity: [
            {
              title: 'Kettlebell Swing',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
            {
              title: 'Kettlebell Goblet Squat',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
            {
              title: 'Kettlebell Clean',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
            {
              title: 'Kettlebell Push Press',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
          ],
        }],
      }),
    },
  },
});

const getTrainings = new sdk.Item({
  name: 'Get Trainings',
  request: {
    method: 'GET',
    url: apiEndpoint + '/trainings' + queryParams,
  },
});

const getTraining = new sdk.Item({
  name: 'Get Training',
  request: {
    method: 'GET',
    url: apiEndpoint + '/trainings/{{trainingId}}',
  },
});

const updateTraining = new sdk.Item({
  name: 'Update Training',
  request: {
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    method: 'PUT',
    url: apiEndpoint + '/trainings/{{trainingId}}',
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        title: 'Savage Shred W1D1',
        description:
          'Part 1: METCON (Circuit of 4 rounds) Keep intensity at 75-80%., you should feel challanged, but not going all out. Take kettlebell weight that coincides with your fitness level. Adjust your rest, if necessary.',
        coachId: '{{coachId}}',
        intensity: 5,
        equipment: null,
        program: [{
          title: 'Part 1: METCON',
          rounds: 4,
          activity: [
            {
              title: 'Kettlebell Swing',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
            {
              title: 'Kettlebell Goblet Squat',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
            {
              title: 'Kettlebell Clean',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
            {
              title: 'Kettlebell Push Press',
              duration: 60,
              trainingId: null,
            },
            {
              title: 'Rest',
              duration: 45,
              trainingId: null,
            },
          ],
        }],
      }),
    },
  },
});

const deleteTraining = new sdk.Item({
  name: 'Delete Training',
  request: {
    method: 'DELETE',
    url: apiEndpoint + '/trainings/{{trainingId}}',
  },
});

const queryTraining = new sdk.Item({
  name: 'Query Training',
  request: {
    method: 'POST',
    header: [new sdk.Header({ key: 'Content-Type', value: 'application/json' })],
    url: apiEndpoint + '/trainings/query' + queryParams,
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        operator: '$and',
        criteria: [
          {
            operator: '$eq',
            field: 'title',
            value: 'Savage^',
          },
          {
            operator: '$eq',
            field: 'intensity',
            value: '5',
          },
        ],
      }),
    },
  },
});

trainingsFolder.items.add(createTraining);
trainingsFolder.items.add(getTrainings);
trainingsFolder.items.add(getTraining);
trainingsFolder.items.add(updateTraining);
trainingsFolder.items.add(deleteTraining);
trainingsFolder.items.add(queryTraining);

// ***********************************************************************************
// Add folders to collection
// ***********************************************************************************
collection.items.add(authFolder);
collection.items.add(usersFolder);
collection.items.add(exercisesFolder);
collection.items.add(trainingsFolder);

// Create JSON file
const collectionJson = collection.toJSON();

fs.writeFile('./postman/UCoach API.postman_collection.json', JSON.stringify(collectionJson), (err) => {
  if (err) {
    throw err;
  }
  console.log('Collection file created successfully!');
});
