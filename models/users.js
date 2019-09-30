module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    // Giving the Users model a name of type STRING
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
  Users.associate = function(models) {
    // Associating Users with Names
    // When an Users is deleted, also delete any associated Names
    Users.hasMany(models.Names, {
      onDelete: "cascade"
    });
  };
  return Users;
};
