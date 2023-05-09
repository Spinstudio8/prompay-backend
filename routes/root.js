const express = require("express");
const router = express.Router();
const path = require("path");
const { SendEmail } = require("../utils/sendMail");

router.get("^/$|/index(.html)?", (req, res) => {
  console.log(req.originalUrl);
  SendEmail("jinaddavid@gmail.com", "html content", "Hello new user");
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
