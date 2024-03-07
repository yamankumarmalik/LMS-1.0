//create a Route(mini express app)
const express = require("express");
const userApp = express.Router();

//get express-async-handler to handle async errors
const expressAsyncHandler = require("express-async-handler");

//import req handlers from Controller
const { loginUser } = require("../Controllers/user-controller");

//admin login
userApp.post("/login", expressAsyncHandler(loginUser));

module.exports = userApp;
