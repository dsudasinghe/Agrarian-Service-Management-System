const router = require("express").Router();
const { EventEnroll } = require("../models/event_enroll");

router.post("/enroll", async(req, resp) => {
    try {
        const registered = await EventEnroll.findOne({
            user: req.body.user,
            event: req.body.event,
        });
        if (registered) {
            return resp.status(201).send({ message: "Already Registered" });
        }
        await new EventEnroll({
            user: req.body.user,
            nic: req.body.nic,
            event: req.body.event,
        }).save();

        return resp.status(200).send({ message: "Successfully Enrolled" });
    } catch (error) {
        console.log(error);
        return resp.status(500).send({ message: error.message });
    }
});

module.exports = router;