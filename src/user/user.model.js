import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Enter your name']
    },
    lastName:{
        type: String,
        required: [true, 'Enter your last name']
    },
    mail: {
        type: String,
        unique: [true, 'The mail already exists'],
        required: [true, 'Enter your email address']
    },
    phone:{
        type: String,
        minLength: [8, 'Enter at least 8 characters in the telephone number'],
        maxLength: [8, 'Enter a maximum of 8 characters in the phone number'],
        unique: [true, 'The phone number already exists'],
        required: true
    },
    username:{
        type: String,
        unique: [true, 'The username already exists'],
        lowercase: true,
        required: [true, 'Enter username']        
    },
    password: {
        type: String,
        minLength: [8, 'Enter at least 8 characters in the password'],
        required: [true, 'You are required to enter the password']
    },
    posts:[{
        publication: {type: Schema.ObjectId, ref: 'publication'},
        title: String
    }]
},{
    versionKey: false
})

export default model('user', userSchema)