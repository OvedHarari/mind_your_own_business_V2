const express = require('express');
require("dotenv").config();
const router = express.Router();
const session = require('express-session');
const jwt = require("jsonwebtoken");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User");

// Session settings
router.use(session({ secret: process.env.GOOGLE_CLIENT_SECRET, resave: false, saveUninitialized: true }));

//Passport initialization
router.use(passport.initialize());
router.use(passport.session());

//Passport Strategy Configuration
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/api/google-auth/auth/google/callback',
            scope: ["profile", "email"],
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => { done(null, user) });
passport.deserializeUser((user, done) => { done(null, user) });

//Routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], }));

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login/failed' }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}/google/success`);
    }
);

router.get("/login/success", async (req, res) => {
    if (req.user) {
        try {
            // Check if user exists
            const user = await User.findOne({ email: req.user._json.email });
            if (!user) return res.status(404).send("Wrong email or password");
            if (!user.isActive) return res.status(404).send("Your User was blocked, please contact System Administrator");

            // Create a JWT token
            const token = jwt.sign(
                { _id: user._id, role: user.role, email: user.email, gender: user.gender, isActive: user.isActive },
                process.env.jwtKey
            );

            // Send the token as a JSON response
            res.status(200).json({
                error: false,
                message: "Successfully Logged In",
                user: req.user,
                token: token,
            })
        } catch (error) {
            res.status(400).send(error);
        }
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect(process.env.CLIENT_URL);
    });
});

module.exports = router;