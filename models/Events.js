const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

export const Events = sequelize.define("Events", {
  USER_ID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdDate: {
    type: DataTypes.DATE,
  },
});
