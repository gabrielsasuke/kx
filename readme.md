# Versões das ferramentas usadas:

- Postman (11.17.1)
- Visual Studio Code (1.94.2)
- Node (20.17.0)
- NPM (10.9.0)
- PostgreSQL (17.0)
- Body-Parser" (^1.20.3)
- EJS (^3.1.10)

# API - KX

Esta API permite a criação, visualização, edição e exclusão de dados. Caso deseje trocar o banco de dados utilizado, modificar a `config.json`. A porta utilizada no Postgres é a `5432`. O banco é gerado toda vez que a aplicação é iniciada, excluindo registros anteriores.

## Endpoints

Todos os Endpoints foram utilizados no `localhost:3000`.

- **GET** `/kx/clientes`: Lista todos os clientes cadastrados.
- **GET** `/kx/clientes/:id`: Busca um cliente específico pelo ID.
- **POST** `/kx/clientes`: Cria um novo cliente.
- **PATCH** `/kx/clientes`: Atualiza os dados de um cliente existente.
- **DELETE** `/kx/clientes`: Exclui um cliente existente.

- **GET** `kx/clientes/html`: Listagem de todos os usuários em uma tabela EJS.

- **GET** `/kx/produtos`: Lista todos os produtos cadastrados.
- **GET** `/kx/produtos/:id`: Busca um produto específico pelo ID.
- **POST** `/kx/produtos`: Cria um novo produto.
- **PATCH** `/kx/produtos`: Atualiza os dados de um produto existente.
- **DELETE** `/kx/produtos`: Exclui um produto existente.

- **GET** `/kx/pedidos`: Lista todos os pedidos cadastrados.
- **GET** `/kx/pedidos/:id`: Busca um pedido específico pelo ID.
- **POST** `/kx/pedidos`: Cria um novo pedido.
- **PATCH** `/kx/pedidos`: Atualiza os dados de um pedido existente.
- **DELETE** `/kx/pedidos`: Exclui um pedido existente.

## Campos

### Campos do Cliente

O modelo `Cliente` possui os seguintes campos:

- `id`: ID do cliente (inteiro, auto-incremento, chave primária)
- `nome`: Nome do cliente (string, obrigatório)
- `telefone`: Telefone do cliente (string)
- `endereco`: Endereço do cliente (string, obrigatório)
- `cep`: CEP do cliente (string, obrigatório)
- `email`: E-mail do cliente (string, obrigatório)
- `cpf`: CPF do cliente (string, obrigatório)

### Campos do Produto

O modelo `Produto` possui os seguintes campos:

- `id`: ID do produto (inteiro, auto-incremento, chave primária)
- `nome`: Nome do produto (string, obrigatório)
- `valor`: Valor do produto (numeric, obrigatório)
- `descricao`: Descrição do produto (string)

### Campos do Pedido

O modelo `Pedido` possui os seguintes campos:

- `id`: ID do pedido (inteiro, auto-incremento, chave primária)
- `idCliente`: ID do cliente que encomendou (inteiro, obrigatório)
- `produtos`: Vetor de características do produto encomendado
    - `id`: ID do produto (inteiro, obrigatório)
    - `quantidade`: Quantidade do produto (inteiro, obrigatório)

## Exemplos de Chamadas

### Criação - Produtos & Visualização - Produtos

Request:

**POST** `http://localhost:3000/kx/produtos`:
```
nome:Objeto
valor:1000
descricao:Objeto de Valor
```

Response:
```
{
    "id": 1,
    "nome": "Objeto",
    "descricao": "Objeto de Valor",
    "valor": "1000.00",
    "updatedAt": "2024-10-24T19:40:10.921Z",
    "createdAt": "2024-10-24T19:40:10.921Z"
}
```

Response:

**GET** `http://localhost:3000/kx/produtos`

```
[
    {
        "id": 1,
        "nome": "Objeto",
        "descricao": "Objeto de Valor",
        "valor": "1000.00",
        "createdAt": "2024-10-24T19:56:32.901Z",
        "updatedAt": "2024-10-24T19:56:32.901Z"
    }
]
```

### Criação - Clientes & Visualização - Clientes

Request:

**POST** `http://localhost:3000/kx/clientes/`
```
nome:Fulano
cep:00000000
endereco:Rua X Y de Z
email:fulano1@gmail.com
telefone:11922334455
cpf:12345678900
```

Response:
```
{
    "id": 1,
    "nome": "Fulano",
    "telefone": "11922334455",
    "endereco": "Rua X Y de Z",
    "cpf": "12345678900",
    "cep": "00000000",
    "email": "fulano1@gmail.com",
    "updatedAt": "2024-10-24T19:40:12.461Z",
    "createdAt": "2024-10-24T19:40:12.461Z"
}
```

Response:

**GET** `http://localhost:3000/kx/clientes/`

```
[
    {
        "id": 1,
        "nome": "Fulano",
        "telefone": "11922334455",
        "endereco": "Rua X Y de Z",
        "cep": "00000000",
        "email": "fulano1@gmail.com",
        "cpf": "12345678900",
        "createdAt": "2024-10-24T19:58:40.291Z",
        "updatedAt": "2024-10-24T19:58:40.291Z"
    }
]
```

### Criação - Pedidos & Visualização - Pedidos

Request:

**POST** `http://localhost:3000/kx/pedidos/`
```
idCliente:1
produtos[0][id]:1
produtos[0][quantidade]:1
//produtos[1][id]:1
//produtos[1][quantidade]:3
```

Response:
```
{
    "pedido": {
        "id": 1,
        "idCliente": 1,
        "updatedAt": "2024-10-24T20:01:55.695Z",
        "createdAt": "2024-10-24T20:01:55.695Z"
    },
    "listaCompleta": [
        {
            "id": 1,
            "nome": "Objeto",
            "descricao": "Objeto de Valor",
            "quantidade": 1,
            "createdAt": "2024-10-24T20:01:55.732Z",
            "updatedAt": "2024-10-24T20:01:55.732Z"
        }
    ]
}
```

Response:

**GET** `http://localhost:3000/kx/pedidos/`

```
[
    {
        "id": 1,
        "idCliente": 1,
        "createdAt": "2024-10-24T20:01:55.695Z",
        "updatedAt": "2024-10-24T20:01:55.695Z"
    }
]
```


