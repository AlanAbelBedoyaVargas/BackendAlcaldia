'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resap37 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Resap37.belongsTo(models.Inscripcion,{as:'inscripcion_resap37', foreignKey:'id_inscripcion'});
      Resap37.belongsTo(models.CriterioEvaluacion,{as:'criterio_resap37', foreignKey:'id_criterio_evaluacion'});
    }
  }
  Resap37.init({
    // uuid: DataTypes.TEXT,
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Esto indica a Sequelize que use UUID versión 4
      allowNull: false,
    },
    estado: DataTypes.STRING(10),
    comentarios: DataTypes.STRING,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Resap37',
    tableName: 'resap37s', // Explicit table name
  });
  return Resap37;
};