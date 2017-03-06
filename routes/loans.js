'use strict';

var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;
var Book = require('../models').Book;


/* GET loan listing. */
router.get('/all', function(req, res, next) {
  Loan.findAll({
    include: [{model: Patron}, {model: Book}]
  }).then(function(loans) {
    res.render('all_loans', {title: 'Loans', loans: loans});
  });
});

router.route('/new')
  .get(function(req, res, next) {
    Book.findAll({
      attributes: ['id', 'title'] 
    // }),
    // Patron.findAll({
    //   attributes: ['id', 'first_name', 'last_name']  
    }).then(function(books, patrons) {
      console.log(books);
      res.render('new_loan', {title: 'New Loan', books: books});
    });
  })
  .post(function(req, res, next){
    Loan.findOne({
      order: 'id DESC',
      limit: 1
    }).then(function(loan){
      Loan.create({
        id: loan.id + 1,
        book_id: req.body.book_id,
        patron_id: req.body.patron_id,
        loaned_on: req.body.loaned_on,
        return_by: req.body.return_by
      })
    }).then(function() {
      res.redirect('loan/all');
    });
  });


// router.get('/overdue', function(req, res, next) {
//   res.render('overdue_loans', {title: 'Overdue Loans'});
// });

// router.get('/checked', function(req, res, next) {
//   res.render('checked_loans', {title: 'Checked Loans'});
//   Loan.find({
//     where: {
//       loaned_on: {
//         $ne: null
//       }
//     },
//     include: [{model: Patron}, {model: Book}]
//   }).then(function(loans){
//     console.log(loans);
//     res.render('checked_loans', {title: 'Checked Loans', loans: loans});
//   });
// });

module.exports = router;
