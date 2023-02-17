require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Question = require('./models/Question');
const users = require('./data/users');
const subjects = require('./data/subjects');
const questions = require('./data/questions');
const { mongodb } = require('./db');

mongodb();

// import data to mongodb
const importData = async () => {
  try {
    // await Subject.deleteMany();
    // await Question.deleteMany();
    await User.deleteMany();

    // const addSubjects = await Subject.insertMany(subjects);
    // const addQuestions = await Question.insertMany(questions);
    const addUsers = await User.insertMany(users);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // await Subject.deleteMany();
    // await Question.deleteMany();
    // await User.deleteMany();

    console.log('Data Destroyed!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// if -d argument is passed from the console
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
