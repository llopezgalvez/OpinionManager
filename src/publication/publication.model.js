import { Schema, model } from "mongoose"

const publicationSchema = new Schema({
    author: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'Enter the user ID']
    },
    title:{
        type: String,
        required: [true, 'Enter the title of the publication']
    },
    category:{
        type: Schema.ObjectId,
        ref: 'category',
        required: [true, 'Enter the category of the publication']
    },
    description:{
        type: String,
        required: [true, 'Enter the description of the publication']
    },
    dateCreation:{
        type: Date, 
        default: Date.now
    },
    comments:[{
        commentID: {type: Schema.ObjectId, ref: 'publicationCommet'},
        user: String,
        comment: String
    }]
},{
    versionKey: false
})


export default model('publication', publicationSchema)