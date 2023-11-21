const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");

export const Temp = sequelize.define("Temp", {
  USER_ID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  primaryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  number: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
