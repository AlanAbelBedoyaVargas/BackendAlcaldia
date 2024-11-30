'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resap37s', {
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
      id_inscripcion: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'inscripcions',
            schema: 'public'
          },
          key: "id",
        },
      },
      id_criterio_evaluacion: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'criterio_evaluacions',
            schema: 'public'
          },
          key: "id",
        },
      },
      estado: {
        type: Sequelize.STRING(10)
      },
      comentarios: {
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
    await queryInterface.dropTable('resap37s');
  }
};