'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Resap.belongsTo(models.Inscripcion,{as:'inscripcion_resap', foreignKey:'id_inscripcion'});
      Resap.belongsTo(models.CriterioEvaluacion,{as:'resap_criterio', foreignKey:'id_criterio_evaluacion'});
    }
  }
  Resap.init({
    uuid: DataTypes.TEXT,
    estado: DataTypes.STRING(10),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Resap',
    tableName: 'resaps'
  });
  return Resap;
};