'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Agrega la columna 'resap' a la tabla 'criterio_evaluacions'
    await queryInterface.addColumn('criterio_evaluacions', 'resap', {
      type: Sequelize.INTEGER, //  para almacenar "Resap33", "Resap37", etc.
      allowNull: true,       // Si deseas que sea obligatorio
    });
  },

  async down (queryInterface, Sequelize) {
    // Elimina la columna 'resap' en caso de hacer rollback
    await queryInterface.removeColumn('criterio_evaluacions', 'resap');
  }
};
