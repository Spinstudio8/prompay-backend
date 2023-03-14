const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const filePath = path.join(
  __dirname,
  '../views',
  'withdrawal-request-message.html'
);
let htmlFile = fs.readFileSync(filePath, 'utf-8');

const user = process.env.GOOGLE_USER;
const pass = process.env.GOOGLE_PASS;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

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

  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user,
      pass,
      clientId,
      clientSecret,
      refreshToken,
      accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `Prompay Wallet Manager<jofwitsolution@gmail.com>`,
    to: ['alagbarason@gmail.com', 'wallet@theprompay.com'],
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
