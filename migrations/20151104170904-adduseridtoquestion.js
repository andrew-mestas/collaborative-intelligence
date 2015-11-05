'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    query
      Example:
    */
   return queryInterface.addColumn('questions', 'userId', 
    { type: Sequelize.INTEGER,
       allowNull: false
     });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
      return queryInterface.removeColumn('questions', 'userId');
  }
};
