const mongoose = require("mongoose");
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: Number, required: true, default: 2 },
});

const Category = mongoose.model("category", userSchema);

const validate = (data) => {
    return Joi.object({
        name: Joi.string().required().label("Name"),
        status: Joi.number()
            .integer()
            .min(0)
            .max(2)
            .required().label("Status"),
    }).validate(data);
};

module.exports = { Category, validate };