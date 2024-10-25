'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    static associate(models) {
      Cliente.hasMany(models.Pedido, {foreignKey: "idCliente"});
    }
  }
  Cliente.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: DataTypes.STRING,
    endereco:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    cep:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'Cliente',
  });
  return Cliente;
};