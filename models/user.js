const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    posts: [
        { type: Schema.Types.ObjectId, ref: "Post" }
    ]
});

module.exports = model("User", userSchema);