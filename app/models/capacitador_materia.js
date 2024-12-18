'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CapacitadorMateria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CapacitadorMateria.belongsTo(models.Resap33,{as:'resap33_capmateria', foreignKey:'id_resap33'});
      CapacitadorMateria.belongsTo(models.Curso,{as:'curso_capmateria' ,foreignKey: 'id_curso' });
    }
  }
  CapacitadorMateria.init({
    uuid: DataTypes.TEXT,
    materias: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CapacitadorMateria',
    tableName: 'capacitardor_materias'
  });
  return CapacitadorMateria;
};