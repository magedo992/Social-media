const nodemailer = require('nodemailer');

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.Email,
            pass:process.env.password
        }
    });

    transporter.sendMail(options, (err, info) => {
        if (err) {
            return console.log(err);
        }

        console.log("Email sent: " + info.response);
    });
};

module.exports = { sendEmail };
