const router = require("express").Router();
const { EventEnroll } = require("../models/event_enroll");
const SendMail = require("../middlewares/sendmail");
const { User, validate2 } = require("../models/user");
const { Events, validate } = require("../models/event");

router.post("/enroll", async (req, resp) => {
  try {
    const registered = await EventEnroll.findOne({
      user: req.body.user,
      event: req.body.event,
    });
    //console.log(req.body);
    if (registered) {
      return resp.status(201).send({ message: "Already Registered" });
    }
    const enroll = await new EventEnroll({
      user: req.body.user,
      nic: req.body.nic,
      event: req.body.event,
    }).save();

    const userData = await User.findOne({
      _id: req.body.user,
    });

    const eventData = await Events.findOne({
      _id: req.body.event,
    });

    if (enroll) {
      SendMail(
        userData.email,
        "Event Enrollment",
        `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">You have enroll with ${eventData.title}</h2>
      <p>Thank you for enrolling with this event.
      <br>
      
      </p>
      
      <a href=# style="background: green; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Schadule your event at ${eventData.startdatetime}</a>
        
      <p>${eventData.description}</p><br>
      <p>if you have a question regarding the Event details, please let us know at easyagroagrarian@gmail.com</p>
  
      
      </div>`
      );
    }

    return resp.status(200).send({ message: "Successfully Enrolled" });
  } catch (error) {
    console.log(error);
    return resp.status(500).send({ message: error.message });
  }
});

module.exports = router;
