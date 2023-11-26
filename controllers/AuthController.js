const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const { Otp } = require("../models");

const sendOtp = async (email) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const code = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OWNER_EMAIL,
      pass: process.env.OWNER_PASSWORD,
    },
  });
  var mailOptions = {
    from: process.env.OWNER_EMAIL,
    to: email,
    subject: "OTP for Login : StudentPortal",
    text: `${code} is your OTP for login`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      Otp.create({
        emailId: email,
        OTP: code,
      });
    }
  });
};

module.exports = sendOtp;