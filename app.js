const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
require("dotenv").config();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/feed", feedRoutes);

mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        app.listen(8080, () => {
            console.log("server on.");
        })
}).catch(err => console.log(err))

