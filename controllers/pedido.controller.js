//kx/produtos

const db = require("../models");
const pedido = require("../models/pedido");
const produto = require("../models/produto");
const PedidoProduto = db.PedidoProduto;
const Pedido = db.Pedido;
const Produto = db.Produto;
require ('../models/pedido_produto');

exports.findOne = (req, res) => {

  const id = parseInt(req.params.id);
  if(!id){
    res.status(400).json({
      message: "Não foi possível encontrar o parâmetro."
    })
  }

  Pedido.findByPk(id)
    .then(pedido => {
      if(pedido) {
        PedidoProduto.findAll({where: {idPedido: id}}) //encontra todos os itens
        .then(listaPedidoProduto =>{
          const listaProdutoId = listaPedidoProduto.map(({ idProduto }) => idProduto); //filtra e coloca os ids de produto em outro vetor
          Produto.findAll({where: {id: listaProdutoId}}) //achar todos os produtos que estão na lista de ID
          .then(produtos => {
            if(produtos){
              const listaCompleta = PedidoProduto.unirProdutoPedido(produtos, listaPedidoProduto);
              res.json({ pedido, listaCompleta});
            }
            else {
              res.status(404).json({
                message: `Mão foi possível encontrar produtos para o pedido ${pedido.id}`,
              });
            }
          }).catch (err => {
            res.status(500).json({
              message: `Erro ao recuperar o pedido com o id ${id}`
            });
        });
        }).catch (err => {
          res.status(500).json({
            message: `Erro ao recuperar a lista dos pedidos com o id ${id}`
          }) 
      });
      }
      else {
        res.status(404).json({
          message: `Pedido com a chave ${id} não foi encontrado.`
        });
      }
    })
    .catch (err => {
        res.status(500).json({
          message: `Erro ao buscar o pedido com o id ${id}`
        }) 
    });
}

exports.findAll = (req, res) => {
  Pedido.findAll()
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
        message: `Erro ao buscar os usuários.`
      })
    })
}

exports.create = (req, res) => {
  //console.log(`${req.body.total} ${req.body.idCliente} ${JSON.stringify(req.body.produtos)}`);
  if(!(req.body.idCliente && req.body.produtos)) {
    res.status(400).json({
      message: `Parâmetros incompletos.`
    });
    return;
  }

  const pedidoRequest = {
    idCliente: req.body.idCliente,
    produtos: req.body.produtos,
  }
  Pedido.create(pedidoRequest)
  .then(pedido => {
    let listaProdutos = [];
    pedidoRequest.produtos.forEach(produto => {
      listaProdutos.push({idPedido: parseInt(pedido.id), idProduto: parseInt(produto.id), quantidade: parseInt(produto.quantidade)});
    });

    PedidoProduto.bulkCreate(listaProdutos)
    .then(listaProdutosInseridos => {
      listaProdutos = listaProdutosInseridos.map(({ idProduto }) => idProduto);
      Produto.findAll({ where: {id: listaProdutos} })
      .then(produtos => {
        if(produtos) {
          const listaCompleta = PedidoProduto.unirProdutoPedido(produtos, listaProdutosInseridos);
          res.json({ pedido, listaCompleta});
        } else {
            res.status(404).json({
              message: `Não foi possível achar os produtos para o pedido ${id}`
            });
        }
      });
    });
  })
  .catch(err => {
    res.status(500).json({
      message: err.message || `Erro interno ao achar pedido para o cliente ${idCliente}`
    });
  });
}

exports.delete = (req, res) => {
  const id = parseInt(req.body.id);
  if(!id) {
    res.status(400).json({
      message: "Parâmetros faltantes. Verifique se o ID está jsono enviado."
    })
    return;
  }

  Pedido.destroy({ where: {id: id}})
  .then(linhasDeletadas => {
    if(linhasDeletadas){
      res.json({
        pedidoId: id,
        deleted: true,
      });
    }
    else {
      res.status(500).json({
        message: `Não foi possível deletar o pedido ${id}.`
      })
    }
  }).catch(err =>{
    res.status(500).json({
      message: err.message || `Ocorreu um erro ao tentar deletar o pedido ${id}`
    })
  })
}

exports.update = (req, res) => {
  const id = parseInt(req.body.id);
  const operacao = req.body.operacao;
  const produtos = req.body.produtos;
  if(!(id && operacao && produtos && (operacao == 'upsert' || operacao == 'delete'))) {
    res.status(400).json({
      message: "Parâmetros faltantes. Verifique se o ID do Pedido, uma operação e a lista de produtos estão jsono enviados."
    })
    return;
  }

Pedido.findByPk(id)
.then(pedido => {
  if(pedido) {
    if(operacao == 'upsert') {
      produtos.forEach(produto =>{
        //Atribuição de IDs, consideradndo as diferenças entre o Postman, o Postgres e o formato esperado do Sequelize
        produto.idPedido = id;
        produto.idProduto = produto.id;
        produto.id = null;
      });
      //Atualizar apenas a quantidade se já existir na base de dados
      PedidoProduto.bulkCreate(produtos, {updateOnDuplicate: ["quantidade"]})
      .then(pedidoProdutoAdicionado => {
        if(pedidoProdutoAdicionado){
          res.json({
            idPedido: id,
            updated: true,
            operacao: 'upsert'
          });
        } else {
          res.status(404).json({
            message: `Não foi possível adicionar ou atualizar os produtos do pedido ${id}`
          });
        }
      }).catch(err => {
        res.status(500).json({
          message: err.message || `Houve um erro ao adicionar produtos no pedido ${id}`
        });
      })
    } else {
      //Extraindo o vetor de IDs e criando um vetor só de IDs a partir de um de objetos
      const idsProdutos = produtos.map(({id}) => id);
      PedidoProduto.destroy({where: {idPedido: id, idProduto: idsProdutos}})
      .then(deletedCount =>{
        if(deletedCount) {
          return res.json({
            idPedido: id,
            updated: true,
            operacao: 'delete'
          });
        } else {
          res.status(404).json({
            message: `Não foi possível remover os produtos do pedido ${pedido.id}`
          });
        }
      })
    }
  } else {
    res.status(404).json({
      message: `Não foi possível encontrar o pedido ${id}`
    });
  }
}).catch(err => {
  res.status(500).json({
    message: err.message || `Houve um erro ao buscar o pedido ${id}`
  })
});
}
