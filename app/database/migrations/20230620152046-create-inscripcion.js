'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inscripcions', {
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
      id_capacitacion: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'capacitacions',
            schema: 'public'
          },
          key: "id",
        },
      },
      estado: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      asistencia: {
        type: Sequelize.STRING(2)
      },
      certificado: {
        type: Sequelize.STRING(2)
      },
      motivo_rechazo: {
        type: Sequelize.STRING(300)
      },
      fecha_inscripcion: {
        type: Sequelize.DATE
      },
      fecha_aprobacion: {
        type: Sequelize.DATE
      },
      usuario_aprobacion: {
        type: Sequelize.INTEGER
      },
      aprobado: {
        type: Sequelize.STRING(2)
      },
      activo: {
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('inscripcions');
  }
};