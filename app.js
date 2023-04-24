const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");

app.use(bodyParser.json());
app.use("/feed", feedRoutes);

app.listen(8080, () => {
    console.log("server on.");
})