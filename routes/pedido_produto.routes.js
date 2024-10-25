const express = require("express");

module.exports = app => {
    const pedido_produto = require("../controllers/pedido_produto.controller.js");
    const express = require("express");
    const router = express.Router();

    router.get("/", pedido_produto.findAll);
    router.get("/:id", pedido_produto.findOne);
    router.post("/", pedido_produto.create);
    app.use("/kx/pedido_produto", router);
}