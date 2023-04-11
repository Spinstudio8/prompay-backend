const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const filePath = path.join(
  __dirname,
  '../views',
  'withdrawal-request-message.html'
);
let htmlFile = fs.readFileSync(filePath, 'utf-8');

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const service = process.env.SMTP_SERVICE;
const user = process.env.SMTP_MAIL;
const pass = process.env.SMTP_PASSWORD;

const sendWithdrawalRequestMessage = async ({
  firstName,
  lastName,
  amount,
  transactionId,
  withdrawalId,
}) => {
  // Replace placeholders with values from the request body
  html = htmlFile
    .replace(/{{firstName}}/g, firstName)
    .replace(/{{lastName}}/g, lastName)
    .replace(/{{amount}}/g, amount)
    .replace(/{{transactionId}}/g, transactionId)
    .replace(/{{withdrawalId}}/g, withdrawalId);

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
    from: `Prompay Wallet Manager<${user}>`,
    to: ['theprompay@gmail.com', 'wallet@theprompay.com'],
    subject: 'Withdrawal request',
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

module.exports.sendWithdrawalRequestMessage = sendWithdrawalRequestMessage;
