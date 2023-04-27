const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
require("dotenv").config();

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
    const { statusCode, message } = error;
    res.status(statusCode).json({message});
})

mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        app.listen(8080, () => {
            console.log("server on.");
        })
}).catch(err => console.log(err))

