'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    prolevel: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    admin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.belongsToMany(models.user, {as : "friend", through : "usersFriends"});
        models.user.hasMany(models.question);
        models.user.hasMany(models.poll);
      },
      authenticate: function(email, password, callback){
        this.find({where:{ email : email}}).then(function(user){
          if(user){
            bcrypt.compare(password, user.password, function(err, result){
              if(err){
                callback(err, false);
              } else{
                callback(null, result ? user : false);
              }
            });
          } else {
            callback(null, false);
          }
        });
      }
    },
       hooks: {
      beforeCreate: function(user, options, callback){
        if(user.password){
          bcrypt.hash(user.password, 10, function(err, hash){
            if(err){
              return callback(err);
            } else {
              user.password = hash;
              callback(null, user);
            }
          });
        }
      }
    }
  });
  return user;
};