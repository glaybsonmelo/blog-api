const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    },
    date: Date  
}, { timestamps: true });


const Post = mongoose.Model('Post', postSchema);

module.exports = Post;