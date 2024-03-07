//import User model
const { User } = require("../db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//User login
const loginUser = async (req, res) => {
  //get user credentials object from req
  const userCredentials = req.body;
  //check username
  let user = await User.findOne({ username: userCredentials.username });
  //if invalid username
  if (user === null) {
    return res.status(200).send({ message: "Invalid username" });
  }
  //if username is found, compare passwords
  const result = await bcryptjs.compare(
    userCredentials.password,
    user.password
  );
  //if password not matched
  if (result === false) {
    return res.status(200).send({ message: "Invalid password" });
  }
  //Create jwt token and sign it
  const signedToken = jwt.sign(
    { username: user.username },
    process.env.SECRET_KEY,
    { expiresIn: "12h" }
  );
  res
    .status(200)
    .send({ message: "login success", token: signedToken, payload: user });
};

module.exports = {
  loginUser,
};
