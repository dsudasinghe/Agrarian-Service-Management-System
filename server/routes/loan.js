const router = require("express").Router();
const { Loan, validate } = require("../models/loan");
const { User, validate2 } = require("../models/user");
const SendMail = require("../models/sendmail");

router.post("/add", async(req, resp) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return resp.status(400).send({ message: error.details[0].message });
        }
        await new Loan({
            nic: req.body.nic,
            user: req.body.user,
            amount: req.body.amount,
            reason: req.body.reason,
        }).save();
        return resp.status(201).send({ message: "Successfully Submitted" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/delete", async(req, resp) => {
    try {
        await Loan.find({ _id: req.body.id }).remove();
        return resp.status(200).send({ message: "Successfully Deleted" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/approve", async(req, resp) => {
    try {
        const data = await User.findOne({ _id: req.body.user });
        console.log(req.body.user);
        if (data) {
            await Loan.find({ _id: req.body.id }).update({
                status: 1,
            });

            SendMail(data.email, "Loan Info", "Your Loan Has Been Approved.");
        }
        return resp.status(201).send({ message: "Successfully Approved" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/reject", async(req, resp) => {
    try {
        const data = await User.findOne({ _id: req.body.user });

        if (data) {
            await Loan.find({ _id: req.body.id }).update({
                status: 2,
            });

            SendMail(data.email, "Loan Info", "Your Loan Has Been Rejected.");
        }
        return resp.status(201).send({ message: "Successfully Rejected" });
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

router.post("/list", async(req, resp) => {
    try {
        let data = [];
        if (req.body.isadmin == 2) {
            data = await Loan.find({ user: req.body.user });
        } else {
            data = await Loan.find();
        }

        return resp.status(200).send(data);
    } catch (error) {
        return resp.status(500).send({ message: error.message });
    }
});

module.exports = router;