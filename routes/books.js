'use strict';

var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;

/* GET book listing. */
router.get('/all', function(req, res, next) {
  Book.findAll({}).then(function(books){
    res.render('all_books', {title: 'Books', books: books});
  });
});

/*New book. */
router.route('/new')
  .get(function(req, res, next) {
    Book.findAll({
    }).then(function(books) {
      res.render('new_book', {title: 'New Book', books: books});
    });
  })
  .post(function(req, res, next){
    Book.findOne({
      order: 'id DESC',
      limit: 1
    }).then(function(book){
      Book.create({
        id: book.id + 1,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        first_published: req.body.first_published
      })
    }).then(function() {
      res.redirect('/book/all');
    });
  });

router.get('/:id', function(req, res, next) {
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
});

router.get('/checked', function(req, res, next) {
  res.render('checked_books', {title: 'Checked Books'});
});

router.get('/overdue', function(req, res, next) {
  res.render('overdue_books', {title: 'Overdue Books'});
});

// router.get('/overdue', function(req, res, next) {
//   Book.find({
//     include: [
//       {model: Loan,
//         where: {
//           return_by: {
//             $lt: new Date()
//           }
//         }
//       }
//     ]
//   }).then(function(books){
//     console.log(books.Loan);
//     res.render('overdue_books', {title: 'Overdue Books', books: books});
//   });
// });


module.exports = router;
