const Post = require("../models/post");

const { validationResult } = require("express-validator");

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