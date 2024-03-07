//import mongoose
const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;
//connect to DB
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connection success!");
  })
  .catch((err) => console.log("Error in DB connect", err));

//create userSchema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required, but missed"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

//create booksSchema
const bookSchema = new mongoose.Schema({
  isbn: {
    type: Number,
    required: [true, "ISBN number is required"],
  },
  title: {
    type: String,
    required: [true, "Title of the book is required"],
  },
  genre: {
    type: String,
    required: [true, "Genre of the book is required"],
  },
  pageCount: {
    type: Number,
    required: [true, "Page Count of the book is required"],
  },
  price: {
    type: Number,
    required: [true, "Price of the book is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Number of books is required"],
  },
  author: {
    type: String,
    required: [true, "Name of the book author is required"],
  },
  image: {
    type: String,
    required: [true, "Image link of the book is required"],
  },
  altText: {
    type: String,
    required: [true, "Alt Text for the image of the book is required"],
  },
});

//create libUser Schema
const libUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  readingList: {
    type: Array,
    required: [true, "Reading List is required!"],
  },
});

//create Model(class) for the userSchema
const User = mongoose.model("user", userSchema);
//create Model(class) for the booksSchema
const Books = mongoose.model("book", bookSchema);
//create Model(class) for the libUsers Schema
const libUser = mongoose.model("libUser", libUserSchema);

//export User model
module.exports = { User, Books, libUser };
