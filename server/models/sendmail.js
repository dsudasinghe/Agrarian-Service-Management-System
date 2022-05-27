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
      user: "easyagroagrarian@gmail.com",
      pass: "easyagro123",
    },
  });

  let info = await transporter.sendMail({
    from: "easyagroagrarian@gmail.com",
    to: to,
    subject: subject,
    html: message,
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendMailNow;
