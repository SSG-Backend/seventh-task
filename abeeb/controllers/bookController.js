const fs = require("fs");
const Book = require("../models/bookModel");

// Get all books
exports.getAllBooks = async (req, res) => {
  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
};

// Get single book with id
exports.getBook = async (req, res) => {
  const id = req.params.id * 1;
  const book = await books.find((el) => el.id === id);
  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "No book found with that ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
};

// Create new book
exports.createBook = async (req, res) => {
  // Generate a new ID based on the last ID
  const newId = books[books.length - 1].id + 1;
  // Get and set (assign and copy) new properties
  const newBook = Object.assign({ id: newId }, req.body);
  //   Add new book object to the books API
  books.push(newBook);

  //  Over-write the existing file with the newly created object
  fs.writeFile("data.json", JSON.stringify(books), () => {
    res.status(201).json({
      status: "success",
      message: "New book created",
      data: {
        book: newBook,
      },
    });
  });
};

// Update single book
exports.updateBook = async (req, res) => {
  // Get book object ID
  const book = await books.find((el) => el.id === req.params.id * 1);

  // If no book object ID
  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "No book found with that ID",
    });
  }

  // Get the field value
  const { title, publisher, year } = req.body;

  let updatedBook = {
    id: book.id,
    title: req.body.title, // set new value for the title
    publisher: req.body.publisher, // set new value for the publisher
    year: req.body.year, // set new value for the year
  };

  // If none of the field set
  if (!title || !publisher || !year) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide fields",
    });
  }

  // find index of book object from array of data
  let bookIndex = books.indexOf(book);

  // Replace the index of book object from the array
  books.splice(bookIndex, 1, updatedBook);

  // Over-write the file and save
  fs.writeFile("data.json", JSON.stringify(books), () => {
    res.status(200).json({
      status: "success",
      message: "Book updated",
      book: updatedBook,
    });
  });
};

// Delete book
exports.deleteBook = async (req, res) => {
  //   console.log(books);
  const book = await books.find((el) => {
    return el.id === req.params.id * 1;
  });
  // If not found
  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "No book found with that ID",
    });
  }
  // find index of book object from array of data
  const bookIndex = books.indexOf(book);

  // Remove the index of book object from the array
  books.splice(bookIndex, 1);

  // Over-write the file and save
  fs.writeFile("data.json", JSON.stringify(books), () => {
    res.status(200).json({
      status: "success",
      message: "Book deleted",
    });
  });
};
