const { validationResult } = require("express-validator");

let _id = 1;

const posts = [
    {
        _id: '1',
        creator: { name: "Grayson" },
        title: "The First Post", 
        content: "This is the first post, say hi.",
        imageUrl: "images/ts.png",
        createdAt: new Date()
    }
]

exports.getPosts = (req, res, next) => {
    res.json({posts});
};

exports.createPost = (req, res, next) => {
    const { title, content } = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect.",
            errors: errors.array()
        })
    }
    const errors = validationResult(req);

    res.status(201).json({
        message: "Post created successfully!",
        post: { _id: _id += 1, title, content, creator: { name: "Grayson" }, createdAt: new Date()}
    })
};