const express = require('express');
const path = require('path');
const app = express();
const email = require('./utils/EmailSender');
require('dotenv').config()

app.get('/', (req, res) => {
    const options = {
        
        to: "ahmeaged900@gmail.com",
        subject: "Your email has expired",
        text: "Please enter to this email, ahmed123"
    };
    email.sendEmail(options);
    res.send('Email sent!');
});

console.log(path.join(__dirname, '/controller/commentController.js'));

app.listen(200, () => {
    console.log('Server running on port 3000');
});
