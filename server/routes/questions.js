const router = require("express").Router();
const { Questions, validate } = require("../models/questions");

router.post("/new", async(req, resp) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
        await new Questions({
            message: req.body.message,
            user: req.body.user,
            status: 2,
        }).save();
        return resp.status(200).send({ message: "Successfully Registered" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/reply", async(req, resp) => {
    try {
        console.log(req.body);
        Questions.find({ _id: req.body.id }).update({
            reply: req.body.reply,
            staff: req.body.staff,
            status: 1,
        });
        return resp.status(200).send({ message: "Successfully Replied" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list", async(req, resp) => {
    try {
        let data = [];
        if (req.body.isadmin == 2) {
            data = await Questions.find({ user: req.body.user });
        } else {
            data = await Questions.find();
        }

        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

module.exports = router;