'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Agregar columna id_curso
    await queryInterface.addColumn('capacitardor_materias', 'id_curso', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'cursos', // Tabla de referencia
          schema: 'public',   // Esquema (opcional si estás usando 'public')
        },
        key: 'id', // Clave primaria en la tabla referenciada
      },
    });

    // // Agregar columna es_otro
    // await queryInterface.addColumn('capacitardor_materias', 'es_otro', {
    //   type: Sequelize.BOOLEAN,
    // });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Eliminar columna id_curso
    await queryInterface.removeColumn('capacitardor_materias', 'id_curso');
    
    // Eliminar columna es_otro
    //await queryInterface.removeColumn('capacitardor_materias', 'es_otro');
  }
};
