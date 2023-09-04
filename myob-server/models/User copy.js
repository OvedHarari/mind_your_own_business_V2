const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
  firstName: {
    type:String,
    required: false,
    minlength: 2

  },
  middleName: {
    type:String,
    required: false,
    minlength: 0,
  },
  lastName: {
    type:String,
    required: false,
    minlength: 2

  },
  phone: {
    type:String,
    required: false,
    minlength: 2

  },
  email: {
    type:String,
    required: true,

  },
  password: {
    type:String,
    required: false,

  },
  userImgURL: {
    type:String,
    required: false,
    minlength: 0,
  },
  gender: {
    type:String,
    required: false,
    minlength: 2

  },
  role: {
    type:String,
    required: false,
    minlength: 2


  },
  country: {
    type:String,
    required: false,
    minlength: 2

  },
  state: {
    type:String,
    required: false,
    minlength: 0,
  },
  city: {
    type:String,
    required: false,
    minlength: 2

  },
  street: {
    type:String,
    required: false,
    minlength: 2

  },
  houseNumber: {
    type:String,
    required: false,
    minlength: 1

  },
  zipcode: {
    type:String,
    required: false,
    minlength: 2

  },
  isActive: {
    type:Boolean,
    required: true,
  },

})

const User = mongoose.model("users", userSchema);
module.exports = User;