"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class sso_employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sso_employees.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      employeeId: DataTypes.INTEGER,
      employeeCode: DataTypes.STRING,
      designationId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
      dateOfBirth: DataTypes.DATE,
      employeeImage: DataTypes.TEXT,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      createdDate: DataTypes.DATE,
      updatedDate: DataTypes.DATE,
      deletedDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "sso_employees",
      paranoid: true,
      createdAt: "createdDate",
      updatedAt: "updatedDate",
      deletedAt: "deletedDate",
    }
  );
  return sso_employees;
};
