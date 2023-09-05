const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const cards = require("./routes/cards");
const favorites = require("./routes/favorites");
const logger = require("morgan");
const chalk = require("chalk");
const path = require('path');
const rfs = require('rotating-file-stream')



const app = express();
const port = process.env.PORT || 5000;


mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log(chalk.blue("MongoDB connected successfully!!!")))
    .catch((err) => console.log((err)))

const accessLogStream = rfs.createStream('errors.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs')
})

app.use(logger("common"));
app.use(logger("common", { stream: accessLogStream, skip: function (req, res) { return res.statusCode < 400 } }));
app.use(express.json());
app.use(cors());

app.use("/api/users", users);
app.use("/api/cards", cards);
app.use("/api/favorites", favorites);

app.get("*", (req, res) => {
    res.send("No existing route...")
})


app.listen(port, () => console.log(chalk.blue(`Server started on port `) + chalk.bgBlue(port)))
