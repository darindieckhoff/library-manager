'use strict';

var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;
var Book = require('../models').Book;

/* GET patron listing. */
router.get('/all', function(req, res, next) {
  Patron.findAll({
  }).then(function(patrons){
    res.render('patrons', {title: 'Patrons', patrons: patrons});
  });
});

/* GET new loan. */
router.get('/new', function(req, res, next) {
  res.render('new_patron', {title: 'New Patron'});
});

router.post('/new', function(req, res, next){
  Patron.findOne({
    order: 'id DESC',
    limit: 1
  }).then(function(patron){
    Patron.create({
      id: patron.id + 1,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      address: req.body.address,
      email: req.body.email,
      library_id: req.body.library_id,
      zip_code: req.body.zip_code
    }).then(function() {
      res.redirect('/patron/all');
    }).catch(function(err){
      res.render('new_patron', {title: 'New Patron', errors: err.errors});
    });
  }).catch(function(err){
    console.log(err);
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
          res.redirect('/patron/all');
        });
  });

module.exports = router;