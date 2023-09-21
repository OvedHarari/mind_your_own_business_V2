const express = require("express");
const router = express.Router();
const joi = require("joi");
const auth = require("../middlewares/auth");
const Card = require("../models/Card");
const _ = require("lodash")

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

//Create Card - business\admin user only
const cardSchema = joi.object({
    title: joi.string().required().min(2), subtitle: joi.string().required().min(2), description: joi.string().required().min(20),
    phone: joi.string().required().min(8), email: joi.string().required().email(), webSite: joi.string().min(10), businessImage: joi.object({ url: joi.string().min(2), alt: joi.string().min(2) }), address: joi.object({ country: joi.string().required().min(2), state: joi.string().min(0), city: joi.string().required().min(2), street: joi.string().required().min(2), houseNumber: joi.string().required().min(1), zipcode: joi.string().min(2), lat: joi.number(), lng: joi.number() }), owner: joi.string().min(2), bizNumber: joi.number()
})


const cardsPropsSchema = joi.object({
    title: joi.string().min(2), subtitle: joi.string().min(2), description: joi.string().min(20),
    phone: joi.string().min(8), email: joi.string().email(), webSite: joi.string().min(10), businessImage: joi.object({ url: joi.string().min(2), alt: joi.string().min(2) }), address: joi.object({ country: joi.string().min(2), state: joi.string().min(0), city: joi.string().min(2), street: joi.string().min(2), houseNumber: joi.string().min(1), zipcode: joi.string().min(2), lat: joi.number(), lng: joi.number() }), owner: joi.string().min(2), bizNumber: joi.number().min(1000000).max(9999999)
})

// Create Card - business\admin user only
router.post("/", auth, async (req, res) => {
    try {
        if (req.payload.role != "admin" && req.payload.role != "business")
            return res.status(400).send("Only Admin/Business users are allowed to add Business Cards");

        // Joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        const generateUniqueBizNumber = async () => {
            const bizNumber = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
            const card = await Card.findOne({ bizNumber });
            if (card) {
                // If a card with this bizNumber exists, try again recursively
                return generateUniqueBizNumber();
            }
            return bizNumber;
        };

        // Generate a unique bizNumber
        const bizNumber = await generateUniqueBizNumber();

        // Check if card exists by name and owner
        const existingCard = await Card.findOne({ name: req.body.title, owner: req.body.owner });
        if (existingCard) return res.status(400).send("Card already exists");

        // Add the new card and save
        const card = new Card({ ...req.body, bizNumber });
        await card.save();

        // Return response
        res.status(201).send(`Card "${card.title}" was added successfully.`);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Update card by card owner\Admin
router.put("/:_id", auth, async (req, res) => {

    try {
        // Confirm if Owner or Admin
        if (req.payload.role != "admin" && req.payload.email != req.body.owner)
            return res.status(400).send("Only Admin or card owner are alloud to update this card")

        // joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        // Verify&Update user by req _id
        const card = await Card.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true });
        if (!card) return res.status(400).send("No such card")

        // return response
        res.status(200).send(`${card.title} was updated successfully!!`)

    } catch (error) {
        res.status(400).send(error)
    }
})

//Delete card
router.delete("/:_id", auth, async (req, res) => {
    try {
        // Confirm if Owner or Admin
        if (req.payload.role != "admin" && req.payload.email != req.body.owner)
            return res.status(400).send("Only Admin or card owner are alloud to delete this card")

        // Check if exist and delete Card
        const card = await Card.findOneAndDelete({ _id: req.params._id });
        if (!card) return res.status(400).send("This Business Card details are not available...");

        // return response
        res.status(200).send(`${card.title} was deleted successfully!!`);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch("/:_id", auth, async (req, res) => {

    try {
        if (req.payload.role != "admin" && req.payload.role != "business")
            return res.status(400).send("Only Admin or business users are alloud to update Business cards")
        if (req.payload.role != "admin" && req.body.bizNumber)
            return res.status(400).send("Only Admin are alloud to update Business Number")
        if (req.body.bizNumber) {
            const existingBizNumber = await Card.findOne({ bizNumber: req.body.bizNumber });
            if (existingBizNumber) {
                return res.status(400).send(`Card with bizNumber ${req.body.bizNumber} already exists please try a diferent number`);
            }
        }

        //1. joi validation
        const { error } = cardsPropsSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        // 1. find user to update
        let card = await Card.findById(req.params._id);
        if (!card) return res.status(400).send("No such user")

        // 2. update the user with the request body 
        card = Object.assign(card, req.body)

        // 3. update db with new user
        await card.save()

        //4. return response
        res.status(200).send(`${card.title} card bizNubber was changed to ${card.bizNumber}`)

    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router;