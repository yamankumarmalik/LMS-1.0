//create a Route(mini express app)
const express = require("express");
const libUserApp = express.Router();

//get express-async-handler to handle async errors
const expressAsyncHandler = require("express-async-handler");
const verifyToken = require("../Middlewares/verifyToken");

//import req handlers from Controller
const {
  createLibUser,
  loginLibUser,
  readingList,
  getUser,
} = require("../Controllers/libUser-controller");

//libUser CRUD

//create new libUser
libUserApp.post("/create-libUser", expressAsyncHandler(createLibUser));
//get User
libUserApp.get("/getUser/:userEmail", expressAsyncHandler(getUser));
//user login
libUserApp.post("/login", expressAsyncHandler(loginLibUser));
//add to reading list
libUserApp.put("/add-reading-list/:username", expressAsyncHandler(readingList));

module.exports = libUserApp;
