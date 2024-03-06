//create a Route(mini express app)
const express = require("express");
const userApp = express.Router();

//get express-async-handler to handle async errors
const expressAsyncHandler = require("express-async-handler");
const verifyToken = require("../Middlewares/verifyToken");

//import req handlers from Controller
const { createUser, loginUser } = require("../Controllers/user-controller");

//user CRUD

//create user
userApp.post("/create-user", expressAsyncHandler(createUser));
//user login
userApp.post("/login", expressAsyncHandler(loginUser));

module.exports = userApp;
