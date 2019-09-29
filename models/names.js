module.exports = function(sequelize, DataTypes) {
  var Names = sequelize.define("names", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.BOOLEAN, defaultValue: null },
    searchTerm: { type: DataTypes.STRING, allowNull: false }
  });

  Names.associate = function(models) {
    // We're saying that a Names should belong to a User
    // A Names can't be created without a User due to the foreign key constraint
    Names.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Names;
};
