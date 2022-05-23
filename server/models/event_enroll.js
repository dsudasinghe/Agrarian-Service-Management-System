const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: { type: String, required: true },
    nic: { type: String, required: true },
    event: { type: String, required: true },
});

const EventEnroll = mongoose.model("eventenroll", schema);

module.exports = { EventEnroll };