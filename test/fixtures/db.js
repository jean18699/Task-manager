const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'jean 2', email: 'jean1526@gmail.com', password: 'Ab12345',
    
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    
    ]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'emilio', email: 'emilio1526@gmail.com', password: 'Ab12345',
    
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
        }
    
    ]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'my task one',
    completed: false,
    user: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'my task one',
    completed: false,
    user: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'my task one',
    completed: false,
    user: userTwo._id
}

const setupDatabase = async() =>{
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}