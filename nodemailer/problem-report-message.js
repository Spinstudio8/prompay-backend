const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const filePath = path.join(
  __dirname,
  '../views',
  'problem-report-message.html'
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

const sendProblemToSupport = async ({
  firstName,
  lastName,
  email,
  phone,
  location,
  joined,
  area,
  details,
}) => {
  // Replace placeholders with values from the request body
  const html = htmlFile
    .replace(/{{firstName}}/g, firstName)
    .replace(/{{lastName}}/g, lastName)
    .replace(/{{email}}/g, email)
    .replace(/{{phone}}/g, phone)
    .replace(/{{location}}/g, location)
    .replace(/{{joined}}/g, joined)
    .replace(/{{area}}/g, area)
    .replace(/{{details}}/g, details);

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
    to: ['jofwitsolution@gmail.com', 'tosinfakile01@gmail.com'],
    subject: area,
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

module.exports.sendProblemToSupport = sendProblemToSupport;
