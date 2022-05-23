const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async(req, resp) => {
    try {
        const { error } = validate(req.body);

        if (error)
            return resp.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ nic: req.body.nic });

        if (!user) return resp.status(401).send({ message: "Invalid credentails" });

        const validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validatePassword)
            return resp.status(401).send({ message: "Invalid credentails" });
        const token = user.generateAuthToken();
        const userData = {
            name: user.name,
            email: user.email,
            usertype: user.usertype,
            nic: user.nic,
            id: user._id,
        };
        return resp
            .status(200)
            .send({
                data: { token: token, user: userData },
                message: "Logged in successfully",
            });
    } catch (error) {
        return resp.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        nic: Joi.string().required().label("NIC"),
        password: Joi.string().required().label("Password"),
    });

    return schema.validate(data);
};

module.exports = router;