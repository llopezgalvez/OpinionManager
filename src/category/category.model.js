import {Schema, model} from 'mongoose'

const categorySchema = new Schema({
    nameCategory:{
        type: String,
        unique: [true, 'The name already exists'],
        required: [true, 'Enter the name of the category']
    },
    description:{
        type: String,
        required: [true, 'Enter the description of the category']
    }
},{
    versionKey: false
})

export default model('category', categorySchema)