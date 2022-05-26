const router = require("express").Router();
const { object } = require("joi");
const { Questions, validate } = require("../models/questions");
const { User } = require("../models/user");

router.post("/new", async (req, resp) => {
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

router.post("/reply", async (req, resp) => {
  try {
    console.log(req.body);
    const update = await Questions.find({ _id: req.body.id }).update({
      reply: req.body.reply,
      staff: req.body.staff,
      status: 1,
    });

    if (update)
      return resp.status(200).send({ message: "Successfully Replied", update });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/list", async (req, resp) => {
  try {
    let data = [];
    let user = [];
    if (req.body.isadmin == 2) {
      data = await Questions.find({ user: req.body.user });
    } else {
      data = await Questions.find();
    }

    /*let data = [];
    for (let i in list) {
      //console.log(data[i]);
      user = await User.find({ _id: list[i].user });
      //console.log(user);

      data = {
        _id: list[i]._id,
        message: list[i].message,
        reply: list[i].reply,
        nic: user[i].nic,
        name: user[i].name,
      };
    }
    console.log([data]);
    //console.log(output);*/

    return resp.status(200).send(data);
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

module.exports = router;
