const mongoose = require("mongoose");
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    message: { type: String, required: true },
    user: { type: String, required: true },
    reply: { type: String, default: null },
    staff: { type: String, default: null },
    status: { type: Number, required: true, default: 2 },
});

const Questions = mongoose.model("questions", userSchema);

const validate = (data) => {
    return Joi.object({
        message: Joi.string().required().label("Message"),
        user: Joi.string().required().label("User"),
        reply: Joi.string().label("Reply"),
        staff: Joi.string().label("Staff"),
        status: Joi.number()
            .integer()
            .min(0)
            .max(2).label("Status"),
    }).validate(data);
};

module.exports = { Questions, validate };