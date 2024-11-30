'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Empleado.hasMany(models.Users,{as:'user_emplado' ,foreignKey: 'id_empleado' });
      Empleado.hasMany(models.Inscripcion,{as:'emplado_inscripcion' ,foreignKey: 'id_empleado' });
      Empleado.hasMany(models.Resap33,{as:'empleado_resap33' ,foreignKey: 'id_empleado' });
    }
  }
  Empleado.init({
    uuid: DataTypes.TEXT,
    cod_empleado: DataTypes.INTEGER,
    ci: DataTypes.STRING(10),
    nombre: DataTypes.STRING(20),
    otro_nombre: DataTypes.STRING(20),
    paterno: DataTypes.STRING(20),
    materno: DataTypes.STRING(20),
    item: DataTypes.INTEGER,
    cargo: DataTypes.STRING(100),
    unidad: DataTypes.STRING(200),
    tipo_contrato: DataTypes.INTEGER,    
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Empleado',
    tableName: 'empleados',
  });
  return Empleado;
};