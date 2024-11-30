'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resap33s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.TEXT,
        defaultValue: Sequelize.literal( 'uuid_generate_v4()' ),
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
      sector: {
        type: Sequelize.STRING
      },
      secretaria: {
        type: Sequelize.STRING
      },
      dirección: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('resap33s');
  }
};