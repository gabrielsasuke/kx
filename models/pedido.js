'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    static associate(models) {
      //Cascade para recriação do banco
      Pedido.belongsTo(models.Cliente, {foreignKey: "idCliente", onDelete: "cascade"});
      Pedido.belongsToMany(models.Produto, {through: models.PedidoProduto, foreignKey: "idPedido"});
    }
  }
  Pedido.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCliente:{
      type:DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    modelName: 'Pedido',
  });
  return Pedido;
};