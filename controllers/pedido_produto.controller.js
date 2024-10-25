//kx/produtos

const db = require("../models");
const Pedido_Produto = db.Pedido_Produto;

exports.findOne = (req, res) => {
  const id = req.params.id;
  Pedido_Produto.findByPk(id)
    .then(data => {
      if(data) {
        res.json(data);
      }
      else {
        res.status(404).json({
          message: `Pedido de Produto com a chave ${id} não foi encontrado.`
        });
      }
    })
    .catch (err => {
        res.status(500).json({
          message: `Erro ao buscar o pedido de produto com o id ${id}`
        }) 
    });
}

exports.findAll = (req, res) => {
    Pedido_Produto.findAll()
    .then(data => {
      if(data) {
        res.json(data);
      }
      else {
        res.status(404).json({
          message: `Erro! Não foi encontrado nenhum registro.`
        });
      }
    })
    .catch (err => {
      res.status(500).json({
        message: `Erro ao buscar o produto pedido.`
      })
    })
}

exports.create = (req, res) => {
  if(!(req.body.quantidade)) {
    res.status(400).json({
      message: `Parâmetros incompletos.`
    });
    return;
  }

  const pedido_produto = {
    quantidade: req.body.quantidade
  }
  Pedido_Produto.create(pedido_produto)
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.status(500).json({
      message: err.message || `Erro interno ao criar pedido para o produto ${idProduto}`
    });
  })
}