'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('capacitacions', {
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
      codigo: {
        type: Sequelize.INTEGER,// STRING(10)
        autoIncrement: true,
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY
      },
      fecha_fin: {
        type: Sequelize.DATEONLY
      },
      horario_inicio: {
        type: Sequelize.TIME
      },
      horario_fin: {
        type: Sequelize.TIME
      },
      inst_organizadora: {
        type: Sequelize.STRING(200)
      },
      capacitador: {
        type: Sequelize.STRING(100)
      },
      direccion: {
        type: Sequelize.STRING(200)
      },
      carga_horaria: {
        type: Sequelize.INTEGER
      },
      cupo: {
        type: Sequelize.INTEGER
      },
      tipo: {
        type: Sequelize.STRING(10)
      },
      visible: {
        type: Sequelize.STRING(2)
      },
      nombre_archivo: {
        type: Sequelize.STRING
      },
      url_archivo: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.STRING(2)
      },
      activo: {
        type: Sequelize.BIGINT
      },
      gestion: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('capacitacions');
  }
};