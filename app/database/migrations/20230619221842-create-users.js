'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.DataTypes.UUID,        
        defaultValue: Sequelize.literal( 'uuid_generate_v4()' ),  //CREATE EXTENSION IF NOT EXISTS "uuid-ossp";        
        allowNull: false
      },
      id_empleado: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'empleados',
            schema: 'public'
          },
          key: "id",
        },
      },
      ci: {
        type: Sequelize.STRING(15)
      },
      password: {
        type: Sequelize.STRING(175)
      },
      email: {
        type: Sequelize.STRING(50)
      },
      rol: {
        type: Sequelize.STRING(50)
      },
      status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('users');
  }
};