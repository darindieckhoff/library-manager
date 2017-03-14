'use strict';

var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;

/* GET book listing. */
router.get('/page/:id', function(req, res, next) {
  Book.findAll({
  }).then(function(allBooks){
    var pages = Math.ceil(allBooks.length/5);
    if (req.params.id === 1) {
      Book.findAll({
        order: 'id',
        limit: 5
      }).then(function(books){
        res.render('books', {title: 'Books', books: books, pages:pages});
      })
    } else {
      (req.params.id * 5)
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


/*New book. */
router.route('/new')
  .get(function(req, res, next) {
    res.render('new_book', {title: 'New Book'});
  })
  .post(function(req, res, next){
    Book.findOne({
      attributes: ['id'],
      order: 'id DESC',
      limit: 1
    }).then(function(book){
      console.log(book.id);
      Book.create({
        id: book.id + 1,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        first_published: req.body.first_published
      }).then(function() {
        res.redirect('/book/all');
      }).catch(function(err){
        res.render('new_book', {title: 'New Book', errors: err.errors});
      });
    }).catch(function(err){
      console.log(err);
    });
  });

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
            res.redirect('/book/all');
          }).catch(function(err){
            res.render('book_detail', {title: 'Book Detail', errors: err.errors});
          });
      }).catch(function(err){
        console.log(err);
      });
  });

module.exports = router;
