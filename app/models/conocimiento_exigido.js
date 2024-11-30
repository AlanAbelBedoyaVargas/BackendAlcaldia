'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConocimientoExigido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConocimientoExigido.belongsTo(models.Resap33, {as:'resap33_conexigido', foreignKey:'id_resap33'});
    }
  }
  ConocimientoExigido.init({
    uuid: DataTypes.TEXT,
    conocimientos: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ConocimientoExigido',
    tableName: 'conocimientos_exigidos'
  });
  return ConocimientoExigido;
};