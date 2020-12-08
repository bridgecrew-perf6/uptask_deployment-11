const path = require("path");
const util = require("util");
const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const { htmlToText } = require("html-to-text");
const emailCfg = require("../config/email");

const transport = nodemailer.createTransport({
  host: emailCfg.host,
  port: emailCfg.port,
  auth: {
    user: emailCfg.user,
    pass: emailCfg.pass,
  },
});

// generar el html para los correos
const generarHTML = (archivo, opciones = {}) => {
  const html = pug.renderFile(
    path.join(__dirname, `../views/emails/${archivo}.pug`),
    opciones
  );

  return juice(html);
};

exports.enviar = async (opciones) => {
  const html = generarHTML(opciones.archivo, opciones.opts);
  const text = htmlToText(html);

  const mailOpts = {
    from: '"Uptask" <no-reply@uptask.com>', // sender address
    to: opciones.usuario, // list of receivers
    subject: opciones.asunto, // Subject line
    text, // plain text body
    html, // html body
  };

  return await transport.sendMail(mailOpts);
};
