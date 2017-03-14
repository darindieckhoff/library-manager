'use strict';

var express = require('express');
var router = express.Router();
var moment = require('moment');
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;
var Book = require('../models').Book;


/* GET loan listing. */
router.get('/all', function(req, res, next) {
  Loan.findAll({
    include: [{model: Patron}, {model: Book}]
  }).then(function(loans) {
    res.render('loans', {title: 'Loans', loans: loans});
  });
});

router.route('/new')
  .get(function(req, res, next) {
    Book.findAll({
      attributes: ['id', 'title'],
      where: { } 
    }).then(function(bookData){
      Patron.findAll({
        attributes: ['id', 'first_name', 'last_name']
      }).then(function(patronData){
        var data = {
          books: bookData,
          patrons: patronData
        }
        res.render('new_loan', {title: 'New Loan', data: data});
      })
    })
  })
  .post(function(req, res, next){
    Loan.findOne({
      attributes: ['id'],
      order: 'id DESC',
      limit: 1
    }).then(function(loan){
      Loan.create({
        id: loan.id + 1,
        book_id: req.body.book_id,
        patron_id: req.body.patron_id,
        loaned_on: req.body.loaned_on,
        return_by: req.body.return_by
      });
    }).then(function() {
      res.redirect('/loan/all');
    }).catch(function(err){
      console.log(err);
    });
  });

router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    where: {
      return_by: {
        $lt: new Date()
      },
      returned_on: {
        $eq: null
      }
    },
    include: [{model: Patron}, {model: Book}]
  }).then(function(loans) {
    res.render('loans', {title: 'Overdue Loans', loans: loans});
  });
});


router.get('/checked', function(req, res, next) {
  Loan.findAll({
    where: {
      loaned_on: {
          $ne: null
        },
        returned_on: {
          $eq: null
        }
    },
    include: [{model: Patron}, {model: Book}]
  }).then(function(loans){
    res.render('loans', {title: 'Checked Loans', loans: loans});
  });
});

router.route('/:id')
  .get(function(req, res, next) {
    Loan.find({
      where: {
        id: req.params.id
      },
      include: [
        {model: Patron}, 
        {model: Book}
      ]
      }).then(function(loan){
        res.render('return_book', {title: 'Return Book', loan: loan})
      });
  })
  .post(function(req, res, next) {
    Loan.findById(req.params.id)
      .then(function(loan){
        loan.update(req.body);
        console.log(req.body.returned_on);
      })
      .then(function(){
      res.redirect('/loan/all');
      });
  });

module.exports = router;
