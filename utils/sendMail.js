const sgMail = require("@sendgrid/mail");
const SendEmail = async (receiver, mailBody, subject = "Welcome") =>
  new Promise(async (resolve, reject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: receiver,
      from: {
        email: process.env.SENDGRID_FROM_MAIL,
        name: process.env.Email_FROM_NAME,
      }, // Use the email address or domain you verified above
      subject: subject,
      // text: "and easy to do anywhere, even with Node.js",
      html: mailBody,
    };

    sgMail.send(msg).then(
      (response) => {
        console.log(response, "SendGrid response");
        resolve(true);
      },
      (error) => {
        console.error(error, "SendGrid");

        if (error.response) {
          console.error(error.response.body);
          reject(false);
        }
      }
    );
  });
module.exports.SendEmail = SendEmail;
