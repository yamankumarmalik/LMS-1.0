//create express app
const express = require("express");
const app = express();
const path = require("path");

//connect angular app with server
app.use(express.static(path.join(__dirname, "../client/dist/lms/browser")));
//configure environment variables
require("dotenv").config();
//add body parsing middleware
app.use(express.json());

//import api
const userApp = require("./APIs/user-api");
const booksApp = require("./APIs/books-api");
const libUserApp = require("./APIs/libUser-api");

//forward req to userApp when path starts with '/user-api'
app.use("/user-api", userApp);
//forward req to booksApp when path starts with '/books-api'
app.use("/books-api", booksApp);
//forward req to libUsersApp when path starts with '/libUser-api'
app.use("/libUser-api", libUserApp);

//so that when the browser refreshes it does not load again
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../client/dist/lms/browser/index.html"));
});

//error handler
app.use((err, req, res, next) => {
  res.send({ message: "Error occurred", payload: err.message });
});

//assign port number
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`web server listening on port ${PORT}.`));
