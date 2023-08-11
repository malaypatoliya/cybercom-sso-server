'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sso_employees', 'employeeEmail', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('sso_employees', 'verificationCode', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('sso_employees', 'verificationExpiry', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sso_employees', 'employeeEmail');
    await queryInterface.removeColumn('sso_employees', 'verificationCode');
    await queryInterface.removeColumn('sso_employees', 'verificationExpiry');
  }
};
