module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define("Event", {
    emailId: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    loggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false            
    }

  });
  return Events;
}

