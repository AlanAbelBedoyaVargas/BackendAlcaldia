'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('funcion_conocimientos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal( 'uuid_generate_v4()' ),
        allowNull: false
      },
      id_resap33: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'resap33s',
            schema: 'public'
          },
          key: "id",
        },
      },
      funciones: {
        type: Sequelize.STRING
      },
      conocimiento_demandado: {
        type: Sequelize.STRING
      },
      prioridad: {
        type: Sequelize.STRING(10)
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
    await queryInterface.dropTable('funcion_conocimientos');
  }
};