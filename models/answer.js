'use strict';
module.exports = function(sequelize, DataTypes) {
  var answer = sequelize.define('answer', {
    answer: DataTypes.STRING,
    rank: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.answer.belongsTo(models.question);
        models.answer.belongsTo(models.category);
      }
    }
  });
  return answer;
};