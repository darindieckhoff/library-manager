'use strict';

var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Patron = require('../models').Patron;


/* GET loan listing. */
router.get('/all', function(req, res, next) {
  Loan.findAll({
    include: [{model: Patron, required: true}]
  }).then(function(loans){
    res.render('all_loans', {title: 'Loans', loans: loans});
  });
});

/* GET new loan. */
router.get('/new', function(req, res, next) {
  res.render('new_loan', {title: 'New Loan'});
});

router.get('/overdue', function(req, res, next) {
  res.render('overdue_loans', {title: 'Overdue Loans'});
});

router.get('/checked', function(req, res, next) {
  res.render('checked_loans', {title: 'Loans'});
});

module.exports = router;
