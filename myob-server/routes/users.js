const express = require("express");
const router = express.Router();
const joi = require("joi");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const _ = require("lodash")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Favorite = require("../models/Favorite");

//Signup schema
const userSchema = joi.object({
    name: joi.object({
        firstName: joi.string().required().min(2),
        middleName: joi.string().min(0),
        lastName: joi.string().required().min(2),
    }),
    phone: joi.string().required().min(8),
    email: joi.string().required().email(),
    password: joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%#^*?&]{8,}$/),
    image: joi.object({ url: joi.string().min(0), alt: joi.string().min(0) }),
    gender: joi.string().required().min(2),
    role: joi.string().required().min(2),
    address: joi.object({
        country: joi.string().required().min(2),
        state: joi.string().min(0),
        city: joi.string().required().min(2),
        street: joi.string().required().min(2),
        houseNumber: joi.string().required().min(1),
        zipcode: joi.string().min(0),
    }),
    isActive: joi.boolean().required(),
});

// SignUp
router.post("/", async (req, res) => {
    try {
        //1. joi validation
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        //2. check if the user already exist
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already exist");

        //3. create the user 
        user = new User(req.body);

        //4. encrypt the password
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        //5 save user after password encryption
        await user.save();

        //create emplty favorites object for registered user.
        let favorites = new Favorite({ userId: user._id, cards: [] })
        await favorites.save()

        //6. create token with jwt and return response with token
        const token = jwt.sign({ _id: user._id, role: user.role, email: user.email, gender: user.gender }, process.env.jwtKey);
        res.status(201).send(token);
    } catch (error) {
        res.status(400).send(error);
    }
})



//signin
const loginSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(8).required(),
});
router.post("/signin", async (req, res) => {
    try {
        //1. joi validation
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        //2. check if user exist
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("Wrong email or password");
        if (!user.isActive) return res.status(404).send("Your User was blocked, please contact System Administrator");

        // 3. check if the user is locked
        if (user.loginAttempts >= 3) {
            const lockoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
            const lockoutEndTime = user.lastFailedLogin.getTime() + lockoutDuration;
            const currentTime = new Date().getTime();

            if (currentTime < lockoutEndTime) {
                return res.status(401).send(`Account locked. Try again in ${Math.ceil((lockoutEndTime - currentTime) / 1000)} seconds.`);
            } else {
                // Reset login attempts if the lockout duration has passed
                user.loginAttempts = 0;
                user.lastFailedLogin = null;
                await user.save();
            }
        }

        //4. check the paassword - compere
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
            // Update failed login attempts and timestamp
            user.loginAttempts += 1;
            user.lastFailedLogin = new Date();
            await user.save();
            return res.status(401).send("Wrong email or password");
        }

        //5. create token and return response with token
        const token = jwt.sign({ _id: user._id, role: user.role, email: user.email, gender: user.gender, isActive: user.isActive }, process.env.jwtKey)
        res.status(200).send(token)

    } catch (error) {
        res.status(400).send(error)
    }
})

// get signed in user (by token _id)
router.get("/profile", auth, async (req, res) => {
    try {
        //1. check&get user by token
        const user = await User.findById(req.payload._id);
        if (!user) return res.status(400).send("No such user")

        //2. return response
        res.status(200).send(_.pick(user, ["_id", "name", "phone", "email", "image", "gender", "role", "address", "isActive"]))
    } catch (error) {
        res.status(400).send(error)
    }
})

// get user by params _id 
router.get("/:_id", auth, async (req, res) => {

    try {
        if (req.payload.role != "admin" && req.payload._id != req.params._id)
            return res.status(400).send("Only Admin or logged in users are alloud to get user detailes")
        //1. check&get user by req _id
        const user = await User.findById(req.params._id);
        if (!user) return res.status(400).send("No such user")

        //2. return response
        res.status(200).send(_.pick(user, ["_id", "name", "phone", "email", "image", "gender", "role", "address", "isActive"]))

    } catch (error) {
        res.status(400).send(error)
    }
})

// get user by params _id 
router.delete("/:_id", auth, async (req, res) => {

    try {
        if (req.payload.role != "admin" && req.payload._id != req.params._id)
            return res.status(400).send("Only Admin or logged in users are alloud to delete user")

        //1. check&get user by req _id
        const user = await User.findOneAndDelete({ _id: req.params._id });
        if (!user) return res.status(400).send("No such user")

        //2. return response
        res.status(200).send(_.pick(user, ["_id", "name", "phone", "email", "image", "gender", "role", "address", "isActive"]))

    } catch (error) {
        res.status(400).send(error)
    }
})

// Update user by params _id 
router.put("/:_id", auth, async (req, res) => {

    try {
        if (req.payload.role != "admin" && req.payload._id != req.params._id)
            return res.status(400).send("Only Admin or logged in users are alloud to update user profile")

        //1. joi validation
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        //2. Verify&Update user by req _id
        const user = await User.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true });
        if (!user) return res.status(400).send("No such user")

        //3. return response
        res.status(200).send(`${user.email} was updated successfully!!`)

    } catch (error) {
        res.status(400).send(error)
    }
});

// Update user property by params _id 
const userPropsSchema = joi.object({
    firstName: joi.string().min(2),
    middleName: joi.string().min(0),
    lastName: joi.string().min(2),
    phone: joi.string().min(8),
    email: joi.string().email(),
    userImgURL: joi.string().min(0),
    gender: joi.string().min(2),
    role: joi.string().min(2),
    country: joi.string().min(2),
    state: joi.string().min(0),
    city: joi.string().min(2),
    street: joi.string().min(2),
    houseNumber: joi.string().min(1),
    zipcode: joi.string().min(2),
    isActive: joi.boolean(),
});


router.patch("/:_id", auth, async (req, res) => {
    try {
        if (req.payload.role != "admin")
            return res.status(400).send("Only Admin or logged in users are alloud to delete user")

        //1. joi validation
        const { error } = userPropsSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        // 1. find user to update
        let user = await User.findById(req.params._id);
        if (!user) return res.status(400).send("No such user")

        // 2. update the user with the request body 
        user = Object.assign(user, req.body)

        // 3. update db with new user
        await user.save()

        //4. return response
        res.status(200).send(`${user.email} was updated successfully!!`)

    } catch (error) {
        res.status(400).send(error)
    }
})

// get all users (Admin Only)
router.get("/", auth, async (req, res) => {
    try {
        // 1. confirm Admin role
        if (req.payload.role != "admin")
            return res.status(400).send("Only Admin is alloud to add products")


        //2. check user
        let users = await User.find();
        if (!users) return res.status(400).send("No users")

        //3. map and pick
        users = _.map(users, (user) => _.pick(user, ["_id", "name", "phone", "email", "image", "gender", "role", "address", "isActive"]))

        //4. return response
        res.status(200).send(users)

    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports = router;