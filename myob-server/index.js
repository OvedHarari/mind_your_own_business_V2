const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const cards = require("./routes/cards");
const favorites = require("./routes/favorites");
const google_auth = require("./routes/google_auth");
const logger = require("morgan");
const chalk = require("chalk");
const path = require('path');
const rfs = require('rotating-file-stream');


const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

//MongoDB Connection string
mongoose.connect(process.env.DB_ATLAS, { useNewUrlParser: true })
    .then(() => console.log(chalk.blue("MongoDB connected successfully!!!")))
    .catch((err) => console.log((err)))

//Set Logger (Terminal=All + Daily file= error >= 400)
const accessLogStream = rfs.createStream('errors.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs')
})
app.use(logger("common"));
app.use(logger("common", { stream: accessLogStream, skip: function (req, res) { return res.statusCode < 400 } }));


// Allowed Origens to prevent cross site due to google-auth
const allowedOrigins = [process.env.CLIENT_URL, process.env.SERVER_URL];
app.use(cors({
    origin: {
        function(origin, callback) {
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true)
        }
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
}));

//Routes
app.use("/api/users", users);
app.use("/api/cards", cards);
app.use("/api/favorites", favorites);
app.use("/api/google-auth", google_auth);
app.get("*", (req, res) => {
    res.send("No existing route...")
})

app.listen(port, () => console.log(chalk.blue(`Server started on port `) + chalk.bgBlue(port)))
