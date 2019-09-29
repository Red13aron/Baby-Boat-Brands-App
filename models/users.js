module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("users", {
    // Giving the Users model a name of type STRING
    name: DataTypes.STRING,
    password: DataTypes.STRING
  });

  return Users;
};
