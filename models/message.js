'use strict';
module.exports = function(sequelize, DataTypes) {
  var message = sequelize.define('message', {
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    answered: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.message.belongsTo(models.user);
      }
    }
  });
  return message;
};