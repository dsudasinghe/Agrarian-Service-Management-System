const router = require("express").Router();
const { Loan, validate } = require("../models/loan");
const { User, validate2 } = require("../models/user");
const SendMail = require("../middlewares/sendmail");

router.post("/add", async (req, resp) => {
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

router.post("/delete", async (req, resp) => {
  try {
    await Loan.find({ _id: req.body.id }).remove();
    return resp.status(200).send({ message: "Successfully Deleted" });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/approve", async (req, resp) => {
  try {
    const data = await User.findOne({ _id: req.body.user });
    console.log(req.body.user);
    if (data) {
      await Loan.find({ _id: req.body.id }).update({
        status: 1,
      });

      SendMail(
        data.email,
        "Loan Approvel",
        `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">Your loan request has been approved.</h2>
      <p>
      <br>
      
      </p>
      
      <a href=# style="background: green; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Mr/Mrs. ${data.name} your loan has been approved.</a>
        
      
      <p>if you have a question regarding the Loan Progress, please let us know at easyagroagrarian@gmail.com</p>
  
      
      </div>`
      );
    }
    return resp.status(201).send({ message: "Successfully Approved" });
  } catch (error) {
    return resp.status(500).send({ message: error.message });
  }
});

router.post("/reject", async (req, resp) => {
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

router.post("/list", async (req, resp) => {
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
