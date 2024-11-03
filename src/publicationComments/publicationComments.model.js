import { Schema, model } from "mongoose"

const publicationComment = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'Enter the user id']
    },
    publication: {
        type: Schema.ObjectId,
        ref: 'publication',
        required: [true, 'Enter the id of the publication']
    },
    comment: {
        type: String,
        required: [true, 'Enter your comment']
    },
    dateCreation: {
        type: Date, 
        default: Date.now
    }
},{
    versionKey: false
})

export default model('publicationComment', publicationComment)