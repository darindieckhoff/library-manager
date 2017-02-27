'use strict';

var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* GET book listing. */
router.get('/all', function(req, res, next) {
  Book.findAll({}).then(function(books){
    res.render('all_books', {title: 'Books', books: books});
  });
});

/* GET new book. */
router.get('/new', function(req, res, next) {
  res.render('new_book', {title: 'New Book'});
});

router.get('/overdue', function(req, res, next) {
  res.render('overdue_books', {title: 'Overdue Books'});
});

router.get('/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book){
      res.render('book_detail', {title: 'Book Detail', book: book});
  });
});

router.get('/checked', function(req, res, next) {
  res.render('checked_books', {title: 'Books'});
});


// // getData('/book/all')
//   .then( function() {
//     res.render('all_books', {title: 'Books'});  
//   })


//promise function for handling GET requests to db.
// function getData (path) {
//   return new Promise (function (resolve, reject) {
//     router.get(path, function (req, res, next) {
//       resolve(req);
//     }); //end get
//   })// end promise
// }//end getData function

module.exports = router;
