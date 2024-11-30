'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Curso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Curso.hasMany(models.Capacitacion,{as:'curso_capacitacion' ,foreignKey: 'id_curso' });
      Curso.hasMany(models.ConocimientoAmpliar,{as:'curso_conampliar' ,foreignKey: 'id_curso' });      
    }
  }
  Curso.init({
    uuid: DataTypes.TEXT,
    codigo: DataTypes.STRING(15),
    nombre: DataTypes.STRING(200),
    contenido: DataTypes.STRING(500),
    dirigido: DataTypes.STRING(300),
    estado: DataTypes.STRING(2),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Curso',
    tableName: 'cursos',
  });
  return Curso;
};