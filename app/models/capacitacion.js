'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Capacitacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Capacitacion.hasMany(models.Inscripcion,{as:'capacitacion_inscripcion', foreignKey:'id_capacitacion'});
      Capacitacion.belongsTo(models.Curso,{as:'capacitacion_curso', foreignKey:'id_curso'});
    }
  }
  Capacitacion.init({
    uuid: DataTypes.TEXT,
    codigo:  DataTypes.INTEGER,
         // DataTypes.STRING(10),
    fecha_inicio: DataTypes.DATEONLY,
    fecha_fin: DataTypes.DATEONLY,
    horario_inicio: DataTypes.TIME,
    horario_fin: DataTypes.TIME,
    inst_organizadora: DataTypes.STRING(200),
    capacitador: DataTypes.STRING(100),
    direccion: DataTypes.STRING(200),
    carga_horaria: DataTypes.INTEGER,
    cupo: DataTypes.INTEGER,
    tipo: DataTypes.STRING(10),
    visible: DataTypes.STRING(2),
    nombre_archivo: DataTypes.STRING,
    url_archivo: DataTypes.STRING,
    estado: DataTypes.STRING(2),
    activo: DataTypes.BIGINT,
    gestion: DataTypes.INTEGER //1,0 
  }, {
    sequelize,
    modelName: 'Capacitacion',
    tableName: 'capacitacions',
    initialAutoIncrement: 1000,
  });
  return Capacitacion;
};