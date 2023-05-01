const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res, next) => {

    const errors =  validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array()
        throw error;
    }

    const { name, email, password } = req.body;
    
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userCreated = await User.create({name, email, password: hashedPassword});
        res.status(201).json({message: "User created!", userId: userCreated._id})
    } catch (error) {
        if(!error.statusCode) error.statusCode = 500;
        next(error)
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if(!user) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual) {
            const error = new Error("Wrong password!");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
                userId: user._id.toString(),
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" });

        res.status(200).json({ token, userId: user._id.toString() });
    } catch (error) {
        if(!error.statusCode) error.statusCode = 500;
        next(error);
    }
};