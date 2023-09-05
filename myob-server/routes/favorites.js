const express = require("express");
const router = express.Router();
const joi = require("joi");
const auth = require("../middlewares/auth");
const Favorite = require("../models/Favorite");
const _ = require("lodash")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



//Get favorites
router.get("/:_id", auth, async (req, res) => {
    try {
        const favorites = await Favorite.findOne({ userId: req.params._id });
        if (!favorites) return res.status(204).send(["No favorite Business cards was selected..."]);
        res.status(200).send(favorites);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Add/Remove favorite cards
router.post("/", auth, async (req, res) => {
    try {
        // 2. find user favorites
        let favorites = await Favorite.findOne({ userId: req.payload._id });

        if (!favorites)
            return res.status(404).send("Something whent wrong, please contact System Administrator");

        // 3. check if card is already in favorites => if true, remove it.
        let inFavorites = favorites.cards.find((fav) => fav._id == req.body._id);


        if (inFavorites) {
            let indexToDelete = favorites.cards.findIndex((fav) => fav._id == req.body._id)
            favorites.cards.splice(indexToDelete, 1);
            favorites.markModified("favorites");
            // res.status(201).send("The card was removed from favorites.");


        } else {
            favorites.cards.push(req.body);
        }

        // 4. add card to favorites array
        await favorites.save();

        // 5 . return a response
        res.status(201).send("The card was added to favorites.");
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;