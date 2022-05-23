const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nic: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    usertype: { type: Number, required: true, default: 3 },
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
};

const User = mongoose.model("user", userSchema);



const validate = (data) => {
    return Joi.object({
        name: Joi.string().required().label("Name"),
        email: Joi.string().required().label("Email"),
        usertype: Joi.number().label("Usertype"),
        nic: Joi.string().required().label("NIC"),
        password: passwordComplexity().required().label("Password"),
    }).validate(data);
};

module.exports = { User, validate };