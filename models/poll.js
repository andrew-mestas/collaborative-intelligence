'use strict';
module.exports = function(sequelize, DataTypes) {
  var poll = sequelize.define('poll', {
    category: DataTypes.STRING,
    question: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.poll.belongsTo(models.user);
        models.poll.hasMany(models.choice,{ onDelete: 'cascade' });

      }
    }
  });
  return poll;
};