//kx/clientes

const db = require("../models");
const Produto = db.Produto;

exports.findOne = (req, res) => {
  const id = req.params.id;
  Produto.findByPk(id)
    .then(data => {
      if(data) {
        res.json(data);
      }
      else {
        res.status(404).json({
          message: `Produto com a chave ${id} não foi encontrado.`
        });
      }
    })
    .catch (err => {
        res.status(500).json({
          message: `Erro ao buscar o Produto com o id ${id}`
        }) 
    });
}

exports.findAll = (req, res) => {
  Produto.findAll()
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
  if(!(req.body.nome && req.body.descricao && req.body.valor)) {
    res.status(400).json({
      message: `Parâmetros incompletos.`
    });
    return;
  }

  const produto = {
    nome: req.body.nome,
    descricao: req.body.descricao,
    valor: req.body.valor,
  }
  Produto.create(produto)
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.status(500).json({
      message: err.message || `Erro interno ao criar produto ${produto.nome}`
    });
  })
}

exports.update = (req, res) => {
  //Transforma o String enviado pelo cliente em Integer
  const id = parseInt(req.body.id);
  if(!id) {
    res.status(400).json({
      message: "Parâmetros faltantes. Verifique se o ID está jsono enviado."
    })
    return;
  }

  Produto.findByPk(id)
  .then(produto => {
    if(produto) {
      produto = {
        //Requisição, usa pra atualizar, caso vazio, ele usa o que já está na base de dados
        nome: req.body.nome || produto.nome,
        descricao: req.body.descricao || produto.descricao,
        valor: req.body.valor || produto.valor
      }
    } else {
      res.status(500).json({
        //Acento pois tem um código JS no meio
        message: `Id do produto ${id} não foi encontrado`
      });
      return;
    }
    //Entra no IF caso um deles seja "falso"
    if(!(produto.nome && produto.descricao && produto.valor && !isNaN([produto.valor]))) {
      res.status(500).json({
        message: `Houve um erro atualizando o produto com o ID ${id}, tenha certeza de providenciar nome, descrição e valor.`
      });
      return;
    }

    Produto.update(produto, {where: {id: id}})
    .then(produto => {
      res.json({
        produtoId: id,
        updated: true,
      });
    }).catch(err => {
        res.status(500).json({
          message: err.message || `Houve um erro atualizando o produto ${produto.nome}`
        })
    })
  })
}

exports.delete = (req, res) => {
  const id = parseInt(req.body.id);
  if(!id) {
    res.status(400).json({
      message: "Parâmetros faltantes. Verifique se o ID está jsono enviado."
    })
    return;
  }

  Produto.destroy({ where: {id: id}})
  .then(linhasDeletadas => {
    if(linhasDeletadas){
      res.json({
        produtoId: id,
        deleted: true,
      });
    }
    else {
      res.status(500).json({
        message: `Não foi possível deletar o produto ${id}.`
      })
    }
  }).catch(err =>{
    res.status(500).json({
      message: err.message || `Ocorreu um erro ao tentar deletar o produto ${id}`
    })
  })
}