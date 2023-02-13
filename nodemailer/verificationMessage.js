const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const filePath = path.join(__dirname, '../views', 'contact-message.html');
let html = fs.readFileSync(filePath, 'utf-8');

const user = process.env.USER;
const pass = process.env.PASS;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const redirectUri = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

const sendCode = async ({
  lastName,
  email,
  verificationCode,
  verificationCodeExpiration,
}) => {
  // Replace placeholders with values from the request body
  html = html
    .replace(/{{lastName}}/g, lastName)
    .replace(/{{email}}/g, email)
    .replace(/{{verificationCode}}/g, verificationCode)
    .replace(/{{verificationCodeExpiration}}/g, verificationCodeExpiration);

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
    from: `Prompay <jofwitsolution@gmail.com>`,
    to: [email],
    subject: 'Verify your account',
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

module.exports.sendCode = sendCode;
