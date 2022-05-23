const router = require("express").Router();
const { Events, validate } = require("../models/event");
const { EventEnroll } = require("../models/event_enroll");

router.post("/add", async(req, resp) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
        await new Events({
            title: req.body.title,
            startdatetime: req.body.startdatetime,
            description: req.body.description,
            status: req.body.status,
        }).save();
        return resp.status(201).send({ message: "Successfully Registered" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/delete", async(req, resp) => {
    try {
        await Events.find({ _id: req.body.id }).remove();
        return resp.status(200).send({ message: "Successfully Deleted" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/update", async(req, resp) => {
    try {
        await Events.find({ _id: req.body.id }).update({
            title: req.body.title,
            startdatetime: req.body.startdatetime,
            description: req.body.description,
            status: req.body.status,
        });
        return resp.status(201).send({ message: "Successfully Updated" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/one", async(req, resp) => {
    try {
        const data = await Events.findOne({ _id: req.body.id });
        return resp.status(data ? 200 : 400).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list", async(req, resp) => {
    try {
        const data = await Events.find();
        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list/active", async(req, resp) => {
    try {
        const data = await Events.find({ status: 1 });
        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list/participatients", async(req, resp) => {
    console.log({ event: req.body.event });
    try {
        const data = await EventEnroll.find({ event: req.body.event });
        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

module.exports = router;