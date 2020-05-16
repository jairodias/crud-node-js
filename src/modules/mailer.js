const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b864ce7e6b6f1b",
    pass: "f12ca74350e2cd"
  }
});