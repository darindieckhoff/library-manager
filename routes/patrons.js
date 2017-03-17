'use strict';

/*
 * /patron/page/#      - GET  | lists all patrons(paginated)
 * /patron/:id         - GET  | details of an individual patron
 * /patron/:id         - POST | updates details of an individual patron
 * /patron/new         - GET  | empty form for adding a new patron
 * /patron/new         - POST | creates a new patron and handles validation errors
 */

var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;
var Book = require('../models').Book;

/* GET patron listing. */
router.get('/page/:id', function(req, res, next) {
  Patron.findAll({
  }).then(function(allPatrons){
    //paginate patrons 5 per page
    var pages = Math.ceil(allPatrons.length/5);
    if (req.params.id === 1) {
      Patron.findAll({
        order: 'id',
        limit: 5
      }).then(function(patrons){
        res.render('patrons', {title: 'Patrons', patrons: patrons, pages:pages});
      });
    } else {
      Patron.findAll({
        order: 'id',
        offset: ((req.params.id * 5)-5),
        limit: 5
      }).then(function(patrons){
        res.render('patrons', {title: 'Patrons', patrons: patrons, pages:pages});
      });
    }
  });
});


/* GET patrons based on chosen column and search input. */
router.get('/search/', function(req, res, next) {
  var searchColumn = req.query.type.toLowerCase();
  var userInput = req.query.search.toLowerCase();
  if (searchColumn === 'zip_code') {
    userInput = parseInt(userInput);
  }
  Patron.findAll({
    where: {
        [searchColumn]: {
          $like: '%' + userInput + '%'
        }
    }
  }).then(function(patrons){
    res.render('patrons', {title: 'Patrons', patrons: patrons, searchColumn: searchColumn, userInput: userInput});
  });
})

/* Loads new loan template */
router.get('/new', function(req, res, next) {
  res.render('new_patron', {title: 'New Patron'});
});

/* Posts new patron data to db */
router.post('/new', function(req, res, next){
  Patron.create(req.body)
    .then(function() {
      res.redirect('/patron/page/1');
    }).catch(function(err){
      res.render('new_patron', {title: 'New Patron', errors: err.errors});
    });
  });

/* GET patron details. Update patron details with user input. */
router.route('/:id')
  .get(function(req, res, next) {
    Patron.find({where: {id: req.params.id},
      include: [
        {
          model: Loan, 
          include:[
            {
              model: Book
            }
          ]
        }
      ]
    }).then(function(patron){
      var loans = patron.Loans;
      res.render('patron_detail', {title: 'Patron Detail', patron: patron, loans: loans});
    });
  })
  .post(function(req, res, next) {
      Patron.findById(req.params.id)
        .then(function(patron){
          patron.update(req.body)
        })
        .then(function(){
          res.redirect('/patron/page/1');
        });
  });

module.exports = router;