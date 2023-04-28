const express = require("express");
const { body } = require("express-validator")

const router = express.Router();

const feedController = require("../controllers/feed");

router.get("/posts", feedController.getPosts);

router.get("/post/:postId", feedController.getPost);

router.post("/post", [
    body('title')
        .trim()
        .isLength({ min: 5, max: 255 }),
    body('content')
        .trim()
        .isLength({ min: 5, max: 2048 })
], feedController.createPost);

router.put("/post/:postId", [
    body('title')
        .trim()
        .isLength({ min: 5, max: 255 }),
    body('content')
        .trim()
        .isLength({ min: 5, max: 2048 })
], feedController.updatePost);

module.exports = router;
