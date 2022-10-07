const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password cant contain the word password')
            }
        }
    }
    ,
    age: {
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    }
});

module.exports = User;