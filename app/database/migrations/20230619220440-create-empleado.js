'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empleados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        //primaryKey: true,
        type: Sequelize.DataTypes.UUID,        
        //defaultValue: Sequelize.UUIDV4, CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        defaultValue: Sequelize.literal( 'uuid_generate_v4()' ),        
        allowNull: false
      },
      cod_empleado: {
        type: Sequelize.INTEGER
      },
      ci: {
        type: Sequelize.STRING(10)
      },
      nombre: {
        type: Sequelize.STRING(20)
      },
      otro_nombre: {
        type: Sequelize.STRING(20)
      },
      paterno: {
        type: Sequelize.STRING(20)
      },
      materno: {
        type: Sequelize.STRING(20)
      },
      item: {
        type: Sequelize.INTEGER
      },
      cargo: {
        type: Sequelize.STRING(100)
      },
      unidad: {
        type: Sequelize.STRING(200)
      },
      tipo_contrato: {
        type: Sequelize.INTEGER
      },      
      activo: {
        type: Sequelize.BIGINT
      },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('empleados');
  }
};
