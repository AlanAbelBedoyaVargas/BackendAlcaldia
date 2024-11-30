'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FuncionConocimiento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FuncionConocimiento.belongsTo(models.Resap33,{as:'resap33_func', foreignKey:'id_resap33'});
    }
  }
  FuncionConocimiento.init({
    uuid: DataTypes.TEXT,
    funciones: DataTypes.STRING,
    conocimiento_demandado: DataTypes.STRING,
    prioridad: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FuncionConocimiento',
    tableName: 'funcion_conocimientos'
  });
  return FuncionConocimiento;
};