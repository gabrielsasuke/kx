const express = require("express");

module.exports = app => {
    const pedidos = require("../controllers/pedido.controller.js");
    const express = require("express");
    const router = express.Router();

    //acha um cliente pelo ID
    router.get("/", pedidos.findAll);
    router.get("/:id", pedidos.findOne);
    router.post("/", pedidos.create);
    router.delete("/", pedidos.delete);
    router.patch("/", pedidos.update);
    app.use("/kx/pedidos", router);
}