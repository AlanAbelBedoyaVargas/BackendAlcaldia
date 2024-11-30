'use strict';
const path = require('path');
const fs = require('fs');
const empleadoDataPath = path.join(__dirname, '../data/empleados.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let employesData =  JSON.parse(fs.readFileSync(empleadoDataPath));
    employesData.forEach(resp => {
        //resp.password = bcrypt.hashSync(resp.password,salt);
        resp.createdAt = new Date(),
        resp.updatedAt = new Date()
      });
    await queryInterface.bulkInsert('empleados', employesData);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
