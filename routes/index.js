'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/return/:id', function(req, res, next) {
  res.render('return_book', {title: 'Return Book'});
});

module.exports = router;
