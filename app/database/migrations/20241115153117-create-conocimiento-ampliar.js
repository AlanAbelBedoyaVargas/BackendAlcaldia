'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conocimiento_ampliars', {
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
      id_curso: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'cursos',
            schema: 'public'
          },
          key: "id",
        },
      },
      conocimientos: {
        type: Sequelize.STRING
      },
      es_otro: {
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
    await queryInterface.dropTable('conocimiento_ampliars');
  }
};