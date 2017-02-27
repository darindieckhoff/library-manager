'use strict';

var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;

/* GET patron listing. */
router.get('/all', function(req, res, next) {
  Patron.findAll({}).then(function(patrons){
    res.render('all_patrons', {title: 'Patrons', patrons: patrons});
  });
});

/* GET new loan. */
router.get('/new', function(req, res, next) {
  res.render('new_patron', {title: 'New Patron'});
});

/* GET patron details. */
router.get('/details', function(req, res, next) {
  res.render('patron_detail', {title: 'Patron'});
});

module.exports = router;