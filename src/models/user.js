const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
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
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    }



);

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse');
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;

}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to log in');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to log in');
    }

    return user;
}

//Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this; //"this" is the current user in the schema
    if(user.isModified('password')){ //funcion perteniente a moongose schema. Es verdadera cuando la entidad se crea o se modifica
        user.password = await bcrypt.hash(user.password, 8)
    }
    next(); //"next" ends this middleware function so the main function "save" can be called
});



const User = mongoose.model('User', userSchema);

module.exports = User; 