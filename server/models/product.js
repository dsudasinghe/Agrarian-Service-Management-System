const mongoose = require("mongoose");
const Joi = require('joi');

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: Number, required: true, default: 2 },
});

const Product = mongoose.model("products", schema);

const validate = (data) => {
    return Joi.object({
        name: Joi.string().required().label("Name"),
        description: Joi.string().required().label("Description"),
        price: Joi.string().required().label("Price"),
        quantity: Joi.string().required().label("Quantity"),
        image: Joi.string().label("image"),
        status: Joi.number()
            .integer()
            .min(0)
            .max(2)
            .required().label("Status"),
    }).validate(data);
};

module.exports = { Product, validate };