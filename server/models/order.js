const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
    total: { type: Number, required: true },
    ref: { type: String, required: true },
    user: { type: String, required: true },
    products: { type: String, required: true },
});

const Orders = mongoose.model("orders", schema);

const validate = (data) => {
    return Joi.object({
        total: Joi.number().required().label("total"),
        ref: Joi.string().required().label("Reference"),
        user: Joi.string().required().label("User"),
        products: Joi.string().required().label("Products"),
    }).validate(data);
};

module.exports = { Orders, validate };