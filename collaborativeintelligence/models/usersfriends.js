'use strict';
module.exports = function(sequelize, DataTypes) {
  var usersFriends = sequelize.define('usersFriends', {
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usersFriends;
};