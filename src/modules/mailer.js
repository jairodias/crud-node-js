const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { host, port, user, pass} = require('../config/mail.json');

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
});

transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  }, /** CONFIGURAÇÃO */
  viewPath: path.resolve('./src/resources/mail/'), /** CAMINHO DO ARQUIVO */
  extName: '.html', /** EXTENSÃO DO ARQUIVO */
}));

module.exports = transport;

/** 
 * PLATAFORMA: https://mailtrap.io/
 * YARN ADD NODEMAILER 
 * YARN ADD NODEMAILER-EXPRESS-HANDLEBARS => templates e forma de preencher variaveis em views
*/