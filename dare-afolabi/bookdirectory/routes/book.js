var express = require('express');
const Book = require('../models/Book');

var router = express.Router();


// GET book listing.
router.get('/', function(req, res) {
  
  Book.find({}, (error, result) => {
    if (error) {
      console.error(error);
      return null;
    }
    if (result != null) {
      res.json(result);
    } else {
      res.json({});
    }
  });
});


// GET a book.
router.get('/:bookIsbn', function(req, res, next) {
  
  Book.findOne({isbn: req.params.bookIsbn}, function(error, result) {
    if (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return;
    } else {
        if (!result) {
          if (res != null) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          }
          return;
        }
        if (res != null) {
          res.setHeader('Content-Type', 'application/json');
          res.send(result);
        }
          console.log(result);
      }
    });



});


// POST(Add) a book.
router.post('/', function(req, res) {
  
  const { isbn, title, category, author, publisher, pages, year } = req.body;
  if(!isbn || !title || !category || !author || !publisher || !pages || !year){
    res.end('All fields are compulsory');
  } else {
    const newBook = new Book({
      isbn,
      title,
      category,
      author,
      publisher,
      pages,
      year
    });

    // Save Book
    newBook.save()
            .then(book => {
              res.json({"addedBook": book});
            })
            .catch(err => console.log(err));
  }
});


// UPDATE(Modify) a book.
router.put('/', function(req, res) {

  const { isbn, title, category, author, publisher, pages, year } = req.body;

  if(!isbn || !title || !category || !author || !publisher || !pages || !year){
    res.end('All fields are compulsory');
  } else {
    var newBook = new Book({
      isbn,
      title,
      category,
      author,
      publisher,
      pages,
      year
    });
  }


  Book.findOne({isbn: req.body.isbn}, function(error, result) {
    if (error) {
      console.error(error);

      res.send(error);
    } else {
        if (!result) {
          console.log('Item does not exist. Creating a new one');
          newBook.save()
            .then(book => {
              res.json({"addedBook": book});
            })
            .catch(err => console.log(err));
        } else {
          console.log('Updating existing item');
          result.isbn = newBook.isbn;
          result.title = newBook.title;
          result.category = newBook.category;
          result.author = newBook.author;
          result.publisher = newBook.publisher;
          result.pages = newBook.pages;
          result.year = newBook.year;

          Book.findOneAndUpdate({ isbn: req.body.isbn }, result, { new: true, useFindAndModify: false }, function(err, result) {
            if (err) {
              res.send(err);
            } else {
              res.json(result);
            }
          });

        }
      }
    });

});

// DELETE(Remove) a book.
router.delete('/:bookIsbn', function(req, res, next) {

  Book.deleteOne({ isbn: req.params.bookIsbn }, function(err, result) {
    if (err) {
      res.send(err);
    } else if (result.ok === 1 && result.deletedCount === 1) {
      console.log(result);
      res.send('Successful deletion');
    } else {
      console.log(result);
      res.send('Unsuccessful deletion');
    }
  });

});

module.exports = router;

