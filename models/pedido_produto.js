'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PedidoProduto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static unirProdutoPedido (listaProduto, listaPedidoProduto) {
      const listaCompleta = [];
      listaPedidoProduto.forEach(pedidoProduto => {
        listaProduto.forEach(produto => {
          if(produto.id == pedidoProduto.idProduto) {
            listaCompleta.push({
              id: produto.id,
              nome: produto.nome,
              descricao: produto.descricao,
              quantidade: pedidoProduto.quantidade,
              createdAt: pedidoProduto.createdAt,
              updatedAt: pedidoProduto.updatedAt,
            });
          }
        });
      });
      return listaCompleta;
    }
  }
  PedidoProduto.init({
    quantidade:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    modelName: 'PedidoProduto',
  });
  return PedidoProduto;
};