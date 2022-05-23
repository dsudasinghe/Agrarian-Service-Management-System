const mongoose = require("mongoose");
const Joi = require("joi");

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true, default: 2 },
});

const Announcement = mongoose.model("announcement", announcementSchema);

const validate = (data) => {
    return Joi.object({
        title: Joi.string().required().label("Title"),
        description: Joi.string().required().label("Description"),
        status: Joi.number().integer().min(0).max(2).required().label("Status"),
    }).validate(data);
};

module.exports = { Announcement, validate };