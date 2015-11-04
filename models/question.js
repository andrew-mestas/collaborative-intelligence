'use strict';
module.exports = function(sequelize, DataTypes) {
  var question = sequelize.define('question', {
    question: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.question.hasMany(models.answer);
        models.question.belongsTo(models.category);
        models.question.belongsTo(models.user);

      }
    }
  });
  return question;
};