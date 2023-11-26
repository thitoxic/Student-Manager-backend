const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const db = require("./models");
const { User } = require("./models");
const { Temp } = require("./models");
const dotenv = require("dotenv");
const sendOtp = require("./controllers/AuthController");
const { Otp } = require("./models");

app.use(express.json());
dotenv.config();

app.get("/settoken", (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    authentication: true,
  };
  const token = jwt.sign(data, jwtSecretKey);

  res.json({ jwtToken: token });
});

app.post("/submit", async (req, res) => {
  const { firstName, lastName, email, number, city, state, schoolName, otp } =
    req.body;
  console.log("req.headers", req.headers);
  jwt.verify(
    req.headers.jwttoken,
    process.env.JWT_SECRET_KEY,
    async (err, authData) => {
      if (err) {
        res.send(err);
      } else {
        let UserEmailExists = await Temp.findOne({
          where: {
            emailId: email,
          },
        });
        if (UserEmailExists) {
          sendOtp(email)
            .then(() => {
              res.status(401).send({
                message:
                  "Student already exists! please check your email for further instructions",
                userAlreadyExists: true,
              });
            })
            .catch((err) => {
              console.log("err", err);
            });
        } else {
          Temp.create({
            firstName: firstName,
            lastName: lastName,
            emailId: email,
            phoneNumber: number,
            city: city,
            state: state,
            schoolName: schoolName,
          })
            .then(() => {
              sendOtp(email);
            })
            .catch((err) => {
              res.status(400).send({
                message: err,
              });
            });
          res.send({
            message: "Student saved Successfully!",
          });
        }
      }
    }
  );

  app.post("/verifyemail", async (req, res) => {
    const { email, otp } = req.body;
    let UserEmailExists = await User.findOne({
      where: {
        emailId: email,
      },
    });
    let tempRecord = await Temp.findOne({
      where: {
        emailId: email,
      },
    });
    let OtpRequestedEmail = await Otp.findOne({
      where: {
        emailId: email,
      },
    });
    console.log('OtpRequestedEmail.OTP', OtpRequestedEmail.OTP)
    if (UserEmailExists && OtpRequestedEmail.OTP === otp) {
      await Otp.destroy({
        where: {
          emailId: email,
        },
      });
      res.status(200).send({
        message: "Logged in Succssfully!",
      });
    } else if (
      !UserEmailExists &&
      tempRecord &&
      OtpRequestedEmail &&
      OtpRequestedEmail.OTP === otp
    ) {
      await User.create({
        firstName: tempRecord.firstName,
        lastName: tempRecord.lastName,
        emailId: tempRecord.emailId,
        phoneNumber: tempRecord.phoneNumber,
        city: tempRecord.city,
        state: tempRecord.state,
        schoolName: tempRecord.schoolName,
      });
      await Temp.destroy({
        where: {
          emailId: email,
        },
      });
      res.status(200).send({
        message: "Registration Succssful!",
      });
    } else {
      res.status(500).send({
        message: "Wrong OTP entered!",
      });
    }
  });

  // jwt.verify(jwtToken, "secretKey", async (err, authData) => {
  //   if (err) {
  //     res.status(403).send({
  //       message: "Authentication failed!",
  //     });
  //   } else if (email) {
  //     let UserEmail = await Users.findOne({
  //       where: {
  //         email: email,
  //       },
  //     });
  //     if (UserEmail) {
  //       if (otp === sendOtp(email)) {
  //         let USER_ID = await Users.findOne({
  //           where: {
  //             USER_ID: email,
  //           },
  //         });
  //         await Events.create({
  //           USER_ID: USER_ID,
  //           date: new Date().getTime(),
  //         });
  //       }
  //       // res.status(400).send({
  //       //   message:
  //       //     "user already Exists. Please check registered email for further login process.",
  //       // });
  //     } else {
  //       await Temp.create({
  //         primaryName: name,
  //         email: email,
  //         number: number,
  //         city: city,
  //         state: state,
  //         schoolName: schoolName,
  //       });
  //       if (otp === sendOtp(email)) {
  //         await Users.create({
  //           USER_ID: email,
  //           primaryName: name,
  //           email: email,
  //           number: number,
  //           city: city,
  //           state: state,
  //           schoolName: schoolName,
  //         });
  //         await Events.create({
  //           USER_ID: USER_ID,
  //           date: new Date().getTime(),
  //         });
  //       }
  //       res.status(200).send({
  //         message: "User created Successfully!",
  //         authData,
  //       });
  //     }
  //   } else {
  //     res.status(500).send({
  //       message: "Something went Wrong!",
  //     });
  //   }
  // });
});

db.sequelize.sync().then((req) => {
  app.listen(4000, () => console.log("listening to port 4000!"));
});
