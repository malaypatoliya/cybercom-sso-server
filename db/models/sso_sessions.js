"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class sso_sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sso_sessions.init(
    {
      sessionId: DataTypes.STRING,
      token: DataTypes.TEXT,
      isActive: DataTypes.INTEGER,
      sourceUrl: DataTypes.STRING,
      createdDate: DataTypes.DATE,
      updatedDate: DataTypes.DATE,
      deletedDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "sso_sessions",
      paranoid: true,
      createdAt: "createdDate",
      updatedAt: "updatedDate",
      deletedAt: "deletedDate",
    }
  );
  return sso_sessions;
};
