const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const cards = require("./routes/cards");
const favorites = require("./routes/favorites");
const logger = require("morgan");


const app = express();
const port = process.env.PORT || 5000;


mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected successfully!!!"))
    .catch((err) => console.log((err)))

app.use(logger("combined"));
app.use(express.json());
app.use(cors());

app.use("/api/users", users);
app.use("/api/cards", cards);
app.use("/api/favorites", favorites);




app.listen(port, () => console.log(`Server started on port ${port}`))
