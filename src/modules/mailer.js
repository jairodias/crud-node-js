const nodemailer = require('nodemailer');
const { host, port, user, pass} = require('../config/mail.json');

const transport = nodemailer.createTransport({
  host,
  auth: { user, pass }
});

module.exports = transport;