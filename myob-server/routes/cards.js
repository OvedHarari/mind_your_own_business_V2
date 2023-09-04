const express = require("express");
const router = express.Router();
const joi = require("joi");
const auth = require("../middlewares/auth");
const Card = require("../models/Card");
const Favorite = require("../models/Favorite");
const _ = require("lodash")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//Get all cards 
router.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        if (!cards) return res.status(400).send("There are no Business Cards to show...");
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Get my-cards
router.get("/my-cards", auth, async (req, res) => {
    try {
        const cards = await Card.find({ owner: req.payload.email });
        console.log(cards);
        if (!cards) return res.status(400).send("There are no Business Cards to show...");
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Get card by _id
router.get("/:_id", async (req, res) => {
    try {
        const card = await Card.findOne({ _id: req.params._id });
        if (!card) return res.status(400).send("This Business Card details are not available...");
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Create Card - by business\admin user 
const cardSchema = joi.object({
    title: joi.string().required().min(2), subtitle: joi.string().required().min(2), description: joi.string().required().min(20),
    phone: joi.string().required().min(2), email: joi.string().required().email(), webSite: joi.string().min(10), businessImage: joi.object({ url: joi.string().min(2), alt: joi.string().min(2) }), address: joi.object({ country: joi.string().required().min(2), state: joi.string().min(0), city: joi.string().required().min(2), street: joi.string().required().min(2), houseNumber: joi.string().required().min(1), zipcode: joi.string().min(2), lat: joi.number(), lng: joi.number() }), owner: joi.string().min(2)
})

router.post("/", auth, async (req, res) => {

    try {
        if (req.payload.role != "admin" && req.payload.role != "business")
            return res.status(400).send("Only Admin/Business users are alloud to add Business Cards")

        //joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        //check if card exist by name and owner
        let card = await Card.findOne({ name: req.body.title, owner: req.body.owner });
        if (card) return res.status(400).send("Card already exist");

        //Add the new card and save
        card = new Card(req.body);
        card.save();
        //return response
        res.status(201).send(`Card "${card.title}" was added successfully.`);

    } catch (error) {
        res.status(400).send(error)
    }
})

//Update card by card owner\Admin
router.put("/:_id", auth, async (req, res) => {

    try {
        if (req.payload.role != "admin" && req.payload.email != req.body.owner)
            return res.status(400).send("Only Admin or card owner are alloud to update this card")

        //1. joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        //2. Verify&Update user by req _id
        const card = await Card.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true });
        if (!card) return res.status(400).send("No such card")

        //3. return response
        res.status(200).send(`${card.title} was updated successfully!!`)

    } catch (error) {
        res.status(400).send(error)
    }
})

//Delete card
router.delete("/:_id", async (req, res) => {
    try {
        const card = await Card.findOneAndDelete({ _id: req.params._id });
        if (!card) return res.status(400).send("This Business Card details are not available...");
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
})



module.exports = router;