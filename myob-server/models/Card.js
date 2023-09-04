const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true,
        minlength: 2
    },
    subtitle: {
        type: String,
        required: false,
        minlength: 0
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    phone: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        minlength: 6
    },
    webSite: {
        type: String,
        required: true,
        minlength: 2
    },
    businessImage: {
        url: {
            type: String,
            required: false,
            minlength: 0
        },
        alt: {
            type: String,
            required: false,
            minlength: 0
        },

    },
    address: {
        country: {
            type: String,
            required: true,
            minlength: 2
        },
        state: {
            type: String,
            required: false,
            minlength: 0
        },
        city: {
            type: String,
            required: true,
            minlength: 2
        },
        street: {
            type: String,
            required: true,
            minlength: 2
        },
        houseNumber: {
            type: String,
            required: true,
            minlength: 1
        },
        zipcode: {
            type: String,
            required: true,
            minlength: 2
        },
        lat: {
            type: Number,
            required: false
        },
        lng: {
            type: Number,
            required: false
        },
    }
})

const Card = mongoose.model("cards", cardSchema);
module.exports = Card;