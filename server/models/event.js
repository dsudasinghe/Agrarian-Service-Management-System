const mongoose = require("mongoose");
const Joi = require("joi");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startdatetime: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true, default: 2 },
});

const Events = mongoose.model("events", eventSchema);

const validate = (data) => {
    return Joi.object({
        title: Joi.string().required().label("Title"),
        startdatetime: Joi.string().required().label("Start Date & Time"),
        description: Joi.string().required().label("Description"),
        status: Joi.number().integer().min(0).max(2).required().label("Status"),
    }).validate(data);
};

module.exports = { Events, validate };