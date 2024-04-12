const mongoose = require('mongoose');
const User = require('./userModel');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: [String],
        required: false
    },
    body:{
        type: String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    assignedTo:{
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    }
}, {timestamps: true});


const ticketPostSchema = new Schema ({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postedBy:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }

},{timestamps:true});

const Blog = mongoose.model('Blog', blogSchema);
const TicketPost = mongoose.model('TicketPost', ticketPostSchema);

module.exports = {
    BlogObj : Blog,
    TicketPostObj: TicketPost
};
