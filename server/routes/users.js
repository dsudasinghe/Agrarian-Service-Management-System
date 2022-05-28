const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");

//email validation
function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//nid validation
function validateNid(nic) {
  var re =
    /^(?:19|20)?\d{2}(?:[0-35-8]\d\d(?<!(?:000|500|36[7-9]|3[7-9]\d|86[7-9]|8[7-9]\d)))\d{4}(?:[vVxX])$/;
  return re.test(String(nic).toLowerCase());
}

router.post("/", async (req, resp) => {
  try {
    delete req.body.password_confirmation;
    const { error } = validate(req.body);

    console.log(req.body);

    if (error) {
      return resp.status(400).send({ message: error.details[0].message });
    }

    // validate NID
    if (!validateNid(req.body.nic))
      return resp.status(400).send({ message: "Invalid NID." });

    //validate email
    if (!validateEmail(req.body.email))
      return resp.status(400).send({ message: "Invalid email." });

    const userExists = await User.findOne({ nic: req.body.nic });
    if (userExists) {
      return resp
        .status(400)
        .send({ message: "NIC already used by another account" });
    }
    const userEmailExists = await User.findOne({ email: req.body.email });
    if (userEmailExists) {
      return resp
        .status(400)
        .send({ message: "Email already used by another account" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
    const hashPw = await bcrypt.hash(req.body.password, salt);

    await new User({
      name: req.body.name,
      email: req.body.email,
      usertype: req.body.usertype,
      nic: req.body.nic,
      password: hashPw,
    }).save();
    return resp.status(201).send({ message: "Successfully Registered" });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/add", async (req, resp) => {
  try {
    delete req.body.password_confirmation;
    const { error } = validate(req.body);
    if (error) {
      return resp.status(400).send({ message: error.details[0].message });
    }
    const userExists = await User.findOne({ nic: req.body.nic });
    if (userExists) {
      return resp
        .status(400)
        .send({ message: "NIC already used by another account" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
    const hashPw = await bcrypt.hash(req.body.password, salt);

    await new User({
      name: req.body.name,
      email: req.body.email,
      usertype: req.body.usertype,
      nic: req.body.nic,
      password: hashPw,
    }).save();
    return resp.status(201).send({ message: "Successfully Registered" });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/delete", async (req, resp) => {
  try {
    await User.find({ _id: req.body.id }).remove();
    return resp.status(200).send({ message: "Successfully Deleted" });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/update", async (req, resp) => {
  try {
    const updateData = {
      name: req.body.name,
      usertype: req.body.usertype,
      nic: req.body.nic,
    };
    if (req.body.password && req.body.password != "") {
      const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
      const hashPw = await bcrypt.hash(req.body.password, salt);
      updateData["password"] = hashPw;
    }
    await User.find({ _id: req.body.id }).update(updateData);
    return resp.status(201).send({ message: "Successfully Updated" });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/one", async (req, resp) => {
  try {
    const data = await User.findOne({ _id: req.body.id });
    return resp.status(data ? 200 : 400).send(data);
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/list", async (req, resp) => {
  try {
    const data = await User.find();
    return resp.status(200).send(data);
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

module.exports = router;
