//import User model
const { User } = require("../db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Create new User
const createUser = async (req, res) => {
  //check for existing user with same username
  let existingUser = await User.findOne({ username: req.body.username });
  //user already existed
  if (existingUser !== null) {
    return res.status(200).send({ message: "User already existed" });
  }
  //if user not existed, then hash password
  const hashedPassword = await bcryptjs.hash(req.body.password, 6);
  //replace plain password with hashed pw
  req.body.password = hashedPassword;
  const newUser = await User.create(req.body);

  res.status(201).send({ message: "User created", payload: newUser });
};
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
    { expiresIn: "1d" }
  );
  res
    .status(200)
    .send({ message: "login success", token: signedToken, payload: user });
};

module.exports = {
  createUser,
  loginUser,
};
