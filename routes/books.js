'use strict';

/*
 * /book/page/#      - GET  | lists all books(paginated)
 * /book/overdue     - GET  | lists all overdue books
 * /book/checked     - GET  | lists all cheked out books
 * /book/:id         - GET  | details of an individual book
 * /book/:id         - POST | updates details of an individual book
 * /book/new         - GET  | empty form for adding a new book
 * /book/new         - POST | creates a new book and handles validation errors
 */

var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;

/* GET book listing. */
router.get('/page/:id', function(req, res, next) {
  Book.findAll({
  }).then(function(allBooks){
    //paginate books 5 per page
    var pages = Math.ceil(allBooks.length/5);
    if (req.params.id === 1) {
      Book.findAll({
        order: 'id',
        limit: 5
      }).then(function(books){
        res.render('books', {title: 'Books', books: books, pages:pages});
      })
    } else {
      Book.findAll({
        order: 'id',
        offset: ((req.params.id * 5)-5),
        limit: 5
      }).then(function(books){
        res.render('books', {title: 'Books', books: books, pages:pages});
      })
    }
  });
});

/* GET books based on chosen column and search input. */
router.get('/search/', function(req, res, next) {
  var searchColumn = req.query.type.toLowerCase();
  var userInput = req.query.search.toLowerCase();
  if (searchColumn === 'first_published') {
    userInput = parseInt(userInput);
  }
  Book.findAll({
    where: {
        [searchColumn]: {
          $like: '%' + userInput + '%'
        }
    }
  }).then(function(books){
    res.render('books', {title: 'Books', books: books, searchColumn: searchColumn, userInput: userInput});
  });
})


/* Loads new book template and updates to db */
router.route('/new')
  .get(function(req, res, next) {
    res.render('new_book', {title: 'New Book'});
  })
  .post(function(req, res, next){
    Book.create(req.body)
      .then(function() {
        res.redirect('/book/page/1');
      }).catch(function(err){
        res.render('new_book', {title: 'New Book', errors: err.errors});
      });
    });

/* Loads overdue books based on return_by date */
router.get('/overdue', function(req, res, next) {
  Book.findAll({
    include: [
      {model: Loan,
        where: {
          return_by: {
            $lt: new Date()
          },
          returned_on: {
            $eq: null
          }
        }
      }
    ]
  }).then(function(books){
    res.render('books', {title: 'Overdue Books', books: books});
  });
});

/* Loads overdue books based on loaned_on and not been returned */
router.get('/checked', function(req, res, next) {
  Book.findAll({
    include: [
      {model: Loan,
        where: {
          loaned_on: {
            $ne: null
          },
          returned_on: {
            $eq: null
          }
        }
      }
    ]
  }).then(function(books){
    res.render('books', {title: 'Overdue Books', books: books});
  });
});

/* Loads book detail based on book ID and updates any user changes */
router.route('/:id')
  .get(function(req, res, next) {
    Book.find({
      where: {
        id: req.params.id
      },
      include: [
        {
          model:Loan,
          include: [Patron]
        }
      ]
    }).then(function(book){
      res.render('book_detail', {title: 'Book Detail', book: book});
    });
  })
  .post(function(req, res, next) {
    Book.findById(req.params.id)
      .then(function(book){
        book.update(req.body)
          .then(function(){
            res.redirect('/book/page/1');
          }).catch(function(err){
            res.render('book_detail', {title: 'Book Detail', errors: err.errors});
          });
      }).catch(function(err){
        console.log(err);
      });
  });

module.exports = router;
