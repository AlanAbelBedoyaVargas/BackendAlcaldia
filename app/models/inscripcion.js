'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscripcion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inscripcion.belongsTo(models.Empleado,{as:'inscripcion_empleado', foreignKey:'id_empleado'});
      Inscripcion.hasMany(models.Resap,{as:'inscripcion_resap', foreignKey:'id_inscripcion'});
      Inscripcion.hasMany(models.Resap37,{as:'inscripcion_resap37', foreignKey:'id_inscripcion'});
      Inscripcion.belongsTo(models.Capacitacion,{as:'incripcion_capacitacion', foreignKey:'id_capacitacion'});
      
    }
  }
  Inscripcion.init({
    uuid: DataTypes.TEXT,
    estado: DataTypes.STRING(10), //pendiente,rechazado, inscrito
    asistencia: DataTypes.STRING(2), //si,no
    certificado: DataTypes.STRING(2),//si,no
    motivo_rechazo: DataTypes.STRING(300),
    fecha_inscripcion: DataTypes.DATE,
    fecha_aprobacion: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    usuario_aprobacion: DataTypes.INTEGER,
    aprobado: DataTypes.STRING(2), //sino
    activo: DataTypes.BIGINT //1,0     
  }, {
    sequelize,
    modelName: 'Inscripcion',
    tableName: 'inscripcions'
  });
  return Inscripcion;
};