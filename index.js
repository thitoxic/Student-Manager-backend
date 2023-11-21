const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const Users = require("./models/Users");
const Temp = require("./models/Temp");
const Events = require("./models/Events");
const { Auth } = require("two-step-auth");

app.use(express.json());

async function sendOtp(email) {
  const res = await Auth(email);
  return res.OTP;
}

app.post("/verifyemail", async (req, res) => {
  const { name, email, grade, number, city, state, schoolName, jwtToken, otp } =
    req.body;
  jwt.verify(jwtToken, "secretKey", async (err, authData) => {
    if (err) {
      res.status(403).send({
        message: "Authentication failed!",
      });
    } else if (email) {
      let UserEmail = await Users.findOne({
        where: {
          email: email,
        },
      });
      if (UserEmail) {
        if (otp === sendOtp(email)) {
          let USER_ID = await Users.findOne({
            where: {
              USER_ID: email,
            },
          });
          await Events.create({
            USER_ID: USER_ID,
            date: new Date().getTime(),
          });
        }
        // res.status(400).send({
        //   message:
        //     "user already Exists. Please check registered email for further login process.",
        // });
      } else {
        await Temp.create({
          primaryName: name,
          email: email,
          grade: grade,
          number: number,
          city: city,
          state: state,
          schoolName: schoolName,
        });
        if (otp === sendOtp(email)) {
          await Users.create({
            USER_ID: email,
            primaryName: name,
            email: email,
            grade: grade,
            number: number,
            city: city,
            state: state,
            schoolName: schoolName,
          });
          await Events.create({
            USER_ID: USER_ID,
            date: new Date().getTime(),
          });
        }
        res.status(200).send({
          message: "User created Successfully!",
          authData,
        });
      }
    } else {
      res.status(500).send({
        message: "Something went Wrong!",
      });
    }
  });
});

app.listen(4000, () => console.log("listening to port 4000!"));
