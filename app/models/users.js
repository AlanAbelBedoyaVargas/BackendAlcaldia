'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here      
      Users.belongsTo(models.Empleado,{as:'empleado_user', foreignKey:'id_empleado'});
      
    }
  }
  Users.init({
    uuid: DataTypes.TEXT,
    ci: DataTypes.STRING(15),
    password: DataTypes.STRING(175),
    email: DataTypes.STRING(50),
    rol: DataTypes.STRING(50),
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Users',    
    tableName:'users'
  });
  return Users;
};