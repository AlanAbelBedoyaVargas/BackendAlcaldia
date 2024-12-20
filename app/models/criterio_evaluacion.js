'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CriterioEvaluacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CriterioEvaluacion.belongsTo(models.TipoEvaluacion,{as:'criterio_tipo', foreignKey:'id_tipo_evaluacion'});
      CriterioEvaluacion.hasMany(models.Resap,{as:'criterio_resap', foreignKey:'id_criterio_evaluacion'});
      CriterioEvaluacion.hasMany(models.Resap37,{as:'criterio_resap37', foreignKey:'id_criterio_evaluacion'});
      
    }
  }
  CriterioEvaluacion.init({
    uuid: DataTypes.TEXT,
    nombre: DataTypes.STRING(200),
    activo: DataTypes.BIGINT,
    resap: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CriterioEvaluacion',
    tableName: 'criterio_evaluacions'
  });
  return CriterioEvaluacion;
};