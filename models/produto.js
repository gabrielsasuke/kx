'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      Produto.belongsToMany(models.Pedido, {through: models.PedidoProduto, foreignKey: "idProduto", onDelete: "cascade"});
    }
  }
  Produto.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: DataTypes.STRING,
    valor:{
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'Produto',
  });
  return Produto;
};