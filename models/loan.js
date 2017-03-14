'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    id: {type: DataTypes.INTEGER, 'primaryKey': true },
    book_id: DataTypes.INTEGER, 
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATEONLY,
    return_by: DataTypes.DATEONLY,
    returned_on: DataTypes.DATEONLY
  }, 
  {
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Loan.belongsTo(models.Patron);
        Loan.belongsTo(models.Book);
      }
    }
  });
  return Loan;
};