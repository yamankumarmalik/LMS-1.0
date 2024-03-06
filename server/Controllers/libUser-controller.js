//import User model
const { libUser } = require("../db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Create new User
const createLibUser = async (req, res) => {
  //check for existing user with same username
  let existingUser = await libUser.findOne({ username: req.body.username });
  //user already existed
  if (existingUser !== null) {
    return res.status(200).send({ message: "User already existed" });
  }
  //if user not existed, then hash password
  const hashedPassword = await bcryptjs.hash(req.body.password, 6);
  //replace plain password with hashed pw
  req.body.password = hashedPassword;
  const newUser = await libUser.create(req.body);

  res.status(201).send({ message: "User created", payload: newUser });
};

//User login
const loginLibUser = async (req, res) => {
  //get user credentials object from req
  const userCredentials = req.body;
  //check username
  let user = await libUser.findOne({ username: userCredentials.username });
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

//const getUser
const getUser = async (req, res) => {
  let user = await libUser.findOne({
    username: req.params.userEmail,
  });
  res.status(201).send({ message: "User Found", payload: user });
};

//update User to update Book Array
const readingList = async (req, res) => {
  const updateUser = await libUser.findOneAndUpdate(
    { username: req.params.username },
    { ...req.body }
  );
  res.status(201).send({ message: "Book Updated", payload: updateUser });
};

//post Reading List array

module.exports = {
  createLibUser,
  loginLibUser,
  getUser,
  readingList,
};
