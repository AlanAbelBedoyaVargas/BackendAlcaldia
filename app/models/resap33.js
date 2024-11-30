'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resap33 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Resap33.belongsTo(models.Empleado,{as:'empleado_resap33', foreignKey:'id_empleado'});
      Resap33.hasMany(models.ConocimientoExigido,{as:'resap33_conexigido', foreignKey:'id_resap33'});
      Resap33.hasMany(models.ConocimientoAmpliar,{as:'resap33_conampliar', foreignKey:'id_resap33'});
      Resap33.hasMany(models.FuncionConocimiento,{as:'resap33_func', foreignKey:'id_resap33'});
      Resap33.hasMany(models.CapacitadorMateria,{as:'resap33_capmateria', foreignKey:'id_resap33'});
    }
  }
  Resap33.init({
    uuid: DataTypes.TEXT,
    sector:DataTypes.STRING, 
    secretaria: DataTypes.STRING,
    dirección: DataTypes.STRING,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Resap33',
    tableName: 'resap33s', // Explicit table name
  });
  return Resap33;
};