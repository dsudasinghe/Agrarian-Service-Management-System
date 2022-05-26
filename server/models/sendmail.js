const nodemailer = require("nodemailer");

async function sendMailNow(to, subject, message) {
  let testAccount = null;
  if (process.env.DEBUGMODE) {
    testAccount = await nodemailer.createTestAccount();
  }
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "sudasinghetrade@gmail.com",
      pass: "lahiru09",
    },
  });

  let info = await transporter.sendMail({
    from: "sudasinghetrade@gmail.com",
    to: to,
    subject: subject,
    text: message,
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendMailNow;
