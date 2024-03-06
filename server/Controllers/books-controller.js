//import Books Model
const { Books } = require("../db");

//Add new Book
const addNewBook = async (req, res) => {
  //check for existing book with same isbn number
  let existingBook = await Books.findOne({
    isbn: req.body.isbn,
  });
  //book already existed
  if (existingBook !== null) {
    return res.status(200).send({ message: "Book already in the database!" });
  }
  //if book not preexisting
  const newBook = await Books.create(req.body);

  res.status(201).send({ message: "Book Added", payload: newBook });
};

//get all Books
const getBooks = async (req, res) => {
  const books = await Books.find();
  res.status(200).send({ message: "books", payload: books });
};

//delete a book
const deleteBook = async (req, res) => {
  const deletedBook = await Books.findByIdAndDelete(req.params.userId);
  res.status(200).send({ message: "Book Deleted", payload: deletedBook });
};

//update a book
const updateBook = async (req, res) => {
  const user = req.body;
  const updateBook = await Books.findOneAndUpdate(
    { isbn: req.body.isbn },
    { ...req.body }
  );
  res.status(201).send({ message: "Book Updated", payload: updateBook });
};

//show book
const showBook = async (req, res) => {
  const book = await Books.findById(req.params.userId);
  res.status(200).send({ message: "Book Found", payload: book });
};

module.exports = {
  addNewBook,
  getBooks,
  deleteBook,
  updateBook,
  showBook,
};
