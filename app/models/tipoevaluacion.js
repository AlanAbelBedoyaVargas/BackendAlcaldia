'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoEvaluacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TipoEvaluacion.hasMany(models.CriterioEvaluacion, {as:'tipo_criterio' ,foreignKey: 'id_tipo_evaluacion' });
    }
  }
  TipoEvaluacion.init({
    uuid: DataTypes.TEXT,
    nombre: DataTypes.STRING(100),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'TipoEvaluacion',
    tableName: 'tipo_evaluacions'
  });
  return TipoEvaluacion;
};