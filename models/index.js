'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// //Models/tables
// db.book = require('../models/book.js')(sequelize, Sequelize);  
// db.loan = require('../models/loan.js')(sequelize, Sequelize);  
// db.patron = require('../models/patron.js')(sequelize, Sequelize);

// //Relations
// db.comments.belongsTo(db.posts);  
// db.posts.hasMany(db.comments);  
// db.posts.belongsTo(db.users);  
// db.users.hasMany(db.posts);

module.exports = db;
