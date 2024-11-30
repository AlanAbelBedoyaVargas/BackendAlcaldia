'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('criterio_evaluacions', {
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
      id_tipo_evaluacion: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'tipo_evaluacions',
            schema: 'public'
          },
          key: "id",
        },
      },
      nombre: {
        type: Sequelize.STRING(200)
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
    await queryInterface.dropTable('criterio_evaluacions');
  }
};