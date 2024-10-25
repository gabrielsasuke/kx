//kx/clientes

const db = require("../models");
const Cliente = db.Cliente;
const PedidoProduto = db.PedidoProduto;
const Pedido = db.Pedido;

exports.findOne = (req, res) => {
  const id = parseInt(req.params.id);
  Cliente.findByPk(id)
    .then(data => {
      if(data) {
        res.json(data);
      }
      else {
        res.status(404).json({
          message: `Cliente com a chave ${id} não foi encontrado.`
        });
      }
    })
    .catch (err => {
        res.status(500).json({
          message: `Erro ao buscar o cliente com o id ${id}`
        }) 
    });
}

exports.findAll = (req, res) => {
  Cliente.findAll()
    .then(data => {
      if(data) {
        res.json(data);
        //res.render('index', { clientes: data });
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

exports.clientesAll = (req, res) => {
  Cliente.findAll()
    .then(data => {
      if(data) {
        res.render('index', { clientes: data });
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
  if(!(req.body.nome && req.body.endereco && req.body.cep && req.body.email)) {
    res.status(400).json({
      message: `Parâmetros incompletos.`
    });
    return;
  }

  const cliente = {
    nome: req.body.nome,
    telefone: req.body.telefone,
    endereco: req.body.endereco,
    cpf: req.body.cpf,
    cep: req.body.cep,
    email: req.body.email,
  }
  Cliente.create(cliente)
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.status(500).json({
      message: err.message || `Erro interno ao criar cliente ${cliente.nome}`
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

  Cliente.findByPk(id)
  .then(cliente => {
    if(cliente) {
      cliente = {
        //Requisição, usa pra atualizar, caso vazio, ele usa o que já está na base de dados
        nome: req.body.nome || cliente.nome,
        telefone: req.body.telefone || cliente.telefone,
        endereco: req.body.endereco || cliente.endereco,
        cpf: req.body.cpf || cliente.cpf,
        cep: req.body.cep || cliente.cep,
        email: req.body.email || cliente.email
      }
    } else {
      res.status(500).json({
        //Acento pois tem um código JS no meio
        message: `Id do cliente ${id} não foi encontrado`
      });
      return;
    }
    //Entra no IF caso um deles seja "falso"
    if(!(cliente.nome && cliente.endereco && cliente.cep && cliente.email)) {
      res.status(500).json({
        message: `Houve um erro atualizando o cliente com o ID ${id}, tenha certeza de providenciar nome, endereço, CEP e e-mail.`
      });
      return;
    }

    Cliente.update(cliente, {where: {id: id}})
    .then(cliente => {
      res.json({
        clienteId: id,
        updated: true,
      });
    }).catch(err => {
        res.status(500).json({
          message: err.message || `Houve um erro atualizando o cliente ${cliente.nome}`
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

  Cliente.destroy({ where: {id: id}})
  .then(linhasDeletadas => {
    if(linhasDeletadas){
      res.json({
        clienteId: id,
        deleted: true,
      });
    }
    else {
      res.status(500).json({
        message: `Não foi possível deletar o cliente ${id}.`
      })
    }
  }).catch(err =>{
    res.status(500).json({
      message: err.message || `Ocorreu um erro ao tentar deletar o cliente ${id}`
    })
  })
}