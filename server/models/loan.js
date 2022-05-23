const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
    user: { type: String, required: true },
    nic: { type: String, required: true },
    amount: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: Number, required: true, default: 3 },
});

const Loan = mongoose.model("loans", schema);

const validate = (data) => {
    return Joi.object({
        nic: Joi.string().required().label("NIC"),
        user: Joi.string().required().label("User"),
        amount: Joi.string().required().label("Amount"),
        reason: Joi.string().required().label("Remark"),
    }).validate(data);
};

module.exports = { Loan, validate };