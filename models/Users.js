module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("User", {
    firstName: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false
    },

  });
  return Users;
}

