'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    id: {type: DataTypes.INTEGER, 'primaryKey': true },
    first_name: {type: DataTypes.STRING, validate: {notEmpty: true}},
    last_name: {type: DataTypes.STRING, validate: {notEmpty: true}},
    address: {type: DataTypes.STRING, validate: {notEmpty: true}},
    email: {type: DataTypes.STRING, validate: {notEmpty: true, isEmail: true}},
    library_id: {type: DataTypes.STRING, validate: {notEmpty: true}},
    zip_code: {type: DataTypes.INTEGER, validate: {notEmpty: true}},
  }, 
  {
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Patron.hasMany(models.Loan);
      }
    }
  });
  return Patron;
};