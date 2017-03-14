'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    id: {type: DataTypes.INTEGER, 'primaryKey': true },
    title: {type: DataTypes.STRING, validate: {notEmpty: true}},
    author: {type: DataTypes.STRING, validate: {notEmpty: true}},
    genre: {type: DataTypes.STRING, validate: {notEmpty: true}},
    first_published: {type: DataTypes.INTEGER, validate: {notEmpty: true, isNumeric: true}},
  }, 
  {
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Book.hasOne(models.Loan);
      }
    }
  });
  return Book;
};