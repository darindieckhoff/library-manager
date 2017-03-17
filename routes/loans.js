'use strict';

/*
 * /loan/page/#      - GET  | lists all books(paginated)
 * /loan/overdue     - GET  | lists all overdue loans
 * /loan/checked     - GET  | lists all checked out loans
 * /loan/:id         - GET  | details of an individual loan
 * /loan/:id         - POST | updates details of an individual bloan
 * /loan/new         - GET  | empty form for adding a new loan
 * /loan/new         - POST | creates a new loan and handles validation errors
 */

var express = require('express');
var router = express.Router();
var moment = require('moment');
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;
var Book = require('../models').Book;

/* GET book listing. */
router.get('/page/:id', function(req, res, next) {
  Loan.findAll({
  }).then(function(allLoans){
    //paginate books 5 per page
    var pages = Math.ceil(allLoans.length/5);
    if (req.params.id === 1) {
      Loan.findAll({
        order: 'Loan.id',
        limit: 5,
        include: [{
          model: Patron, 
          attributes: ['id','first_name', 'last_name']}, 
          {
            model: Book, 
            attributes: ['id','title']
        }]
      }).then(function(loans){
        res.render('loans', {title: 'Loans', loans: loans, pages:pages});
      })
    } else {
      Loan.findAll({
        order: 'Loan.id',
        offset: ((req.params.id * 5)-5),
        limit: 5,
        include: [{
          model: Patron, 
          attributes: ['id', 'first_name', 'last_name']
        }, 
        {model: Book, 
          attributes: ['id', 'title']
        }]
      }).then(function(loans){
        res.render('loans', {title: 'Loans', loans: loans, pages:pages});
      })
    }
  });
});

/* Loads new loan template and posts data to db */
router.route('/new')
  .get(function(req, res, next) {
    Book.findAll({
      attributes: ['id', 'title'],
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
    Loan.create(req.body)
      .then(function() {
        res.redirect('/loan/page/1');
      }).catch(function(err){
        console.log(err);
      });
  });

/* Loads overdue loans based on return_by date */
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

/* Loads overdue loans based on loaned_on and not been returned */
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

/* Loads loan detail based on loan ID and updates any user changes */
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
      res.redirect('/loan/page/1');
      });
  });

module.exports = router;
