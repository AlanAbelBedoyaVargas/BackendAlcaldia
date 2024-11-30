'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConocimientoAmpliar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConocimientoAmpliar.belongsTo(models.Resap33,{as:'resap33_conampliar', foreignKey:'id_resap33'});
      
      ConocimientoAmpliar.belongsTo(models.Curso,{as:'curso_conampliar' ,foreignKey: 'id_curso' });
    }
  }
  ConocimientoAmpliar.init({
    uuid: DataTypes.TEXT,
    conocimientos: DataTypes.STRING,
    es_otro: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ConocimientoAmpliar',
    tableName: 'conocimiento_ampliars',
  });
  return ConocimientoAmpliar;
};