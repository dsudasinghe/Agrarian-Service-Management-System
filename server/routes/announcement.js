const router = require("express").Router();
const { Announcement, validate } = require("../models/announcement");

router.post("/add", async(req, resp) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
        await new Announcement({
            title: req.body.title,
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
        await Announcement.find({ _id: req.body.id }).remove();
        return resp.status(200).send({ message: "Successfully Deleted" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/update", async(req, resp) => {
    try {
        await Announcement.find({ _id: req.body.id }).update({
            title: req.body.title,
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
        const data = await Announcement.findOne({ _id: req.body.id });
        return resp.status(data ? 200 : 400).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list", async(req, resp) => {
    try {
        const data = await Announcement.find();
        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list/active", async(req, resp) => {
    try {
        const data = await Announcement.find();
        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

module.exports = router;