const nodemailer = require("nodemailer");

async function sendMailNow(to, subject, message) {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: (process.env.DEBUGMODE) ? testAccount.user : process.env.EMAILUSERNAME,
            pass: (process.env.DEBUGMODE) ? testAccount.pass : process.env.EMAILPASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: (process.env.DEBUGMODE) ? testAccount.user : process.env.EMAILUSERNAME,
        to: to,
        subject: subject,
        text: message,
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendMailNow;