const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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