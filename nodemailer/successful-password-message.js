const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const filePath = path.join(
  __dirname,
  '../views',
  'successful-password-message.html'
);
let htmlFile = fs.readFileSync(filePath, 'utf-8');

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const service = process.env.SMTP_SERVICE;
const user = process.env.SMTP_MAIL;
const pass = process.env.SMTP_PASSWORD;

const sendSuccessfulPasswordMessage = async ({ email, lastName }) => {
  // Replace placeholders with values from the request body
  const html = htmlFile.replace(/{{lastName}}/g, lastName);

  const transporter = nodemailer.createTransport({
    host,
    port,
    service,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `Prompay <${user}>`,
    to: [email],
    subject: 'Password Reset Successful',
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports.sendSuccessfulPasswordMessage = sendSuccessfulPasswordMessage;
