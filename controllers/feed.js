const path = require("path");
const fs = require("fs");

const Post = require("../models/post");
const { validationResult } = require("express-validator");
const { listeners } = require("process");

exports.getPosts = (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({message: "Fetched posts successfully.",posts});    
    }).catch(err => {
        if(!err.statusCode)
            err.statusCode = 500;
        
        next(err);
    });
  
};

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if(!post) {
            let error = new Error("Post not found.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Post fetched.', post});
    } catch (error) {
        if(!error.statusCode)
            error.statusCode = 500;
        next(error);
    }
};

exports.createPost = (req, res, next) => {

    const errors = validationResult(req);
    const { title, content } = req.body;

    if (!errors.isEmpty()) {
        let erro = new Error("Validation failed, entered data is incorrect.");
        erro.statusCode = 422;
        throw erro;
    }

    if (!req.file) {
        const error = new Error("No image privided.");
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;

    const post = new Post({title, content, imageUrl, creator: {name: "Glaybson"}});
    post.save().then(result => {
        res.status(201).json({
            message: "Post created successfully!",
            post: result
        })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.updatePost = async (req, res, next) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    let imageUrl = req.body.image;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;    
    }

    if(req.file) {
        imageUrl = req.file.path;
    }

    if(!imageUrl) {
        const error = new Error("No file picked.");
        error.statusCode = 422;
        throw error;
    }
    try {
        const post = await Post.findById(postId);
        if(!post) {
            let error = new Error("Post not found.");
            error.statusCode = 404;
            throw error;
        }
        if(imageUrl !== post.image){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;


        const result = await post.save();

        res.status(200).json({message: "Post Updated!", post: result})
    }catch(err) {
        if(!err.statusCode)
            err.statusCode = 500;
        
        next(err);
    }
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
}

exports.deletePost = async (req, res, next) => {
    const { postId } = req.params;
    try{
        const post = await Post.findById(postId);
        if(!post) {
            let error = new Error("Post not found.");
            error.statusCode = 404;
            throw error;
        }
        // check logged in user
        clearImage(post.imageUrl);
        await Post.findByIdAndRemove(post._id);
        res.status(200).json({message: "Deleted post"})
    } catch (err) {
        if(!err.statusCode)
            err.statusCode = 500;
        
        next(err);
    }

}