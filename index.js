const express = require('express');
const bodyParser = require('body-parser');
const { findOne } = require('./controllers/cliente.controller.js');
const { findAll } = require('./controllers/cliente.controller.js');
const app = express();

app.set('view engine', 'ejs');

/*const clienteController = require("./controllers/cliente.controller.js");
const produtoController = require("./controllers/pedido.controller.js");*/

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const clienteController = require('./controllers/cliente.controller');
const cliente = require('./models/cliente.js');

require("./routes/cliente.routes.js")(app);
require("./routes/pedido.route.js")(app);
require("./routes/produto.routes.js")(app);
require("./routes/pedido_produto.routes.js")(app);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get('kx/clientes', clienteController.findAll);