'use strict';
module.exports = function(sequelize, DataTypes) {
  var choice = sequelize.define('choice', {
    value: DataTypes.INTEGER,
    choiceString: DataTypes.STRING,
    pollId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.choice.belongsTo(models.poll,{ onDelete: 'cascade' });
      }
    }
  });
  return choice;
};