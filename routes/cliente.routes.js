const express = require("express");

module.exports = app => {
    const clientes = require("../controllers/cliente.controller.js");
    const express = require("express");
    const router = express.Router();

    //acha um cliente pelo ID
    router.get("/", clientes.findAll);
    router.get("/html", clientes.clientesAll);
    router.get("/:id", clientes.findOne);
    router.post("/", clientes.create);
    //PATCH para atualizar apenas dados enviados
    router.patch("/", clientes.update);
    router.delete("/", clientes.delete);
    app.use("/kx/clientes", router);
}