const express = require("express");

module.exports = app => {
    const produto = require("../controllers/produto.controller.js");
    const express = require("express");
    const router = express.Router();

    //acha um cliente pelo ID
    router.get("/", produto.findAll);
    router.get("/:id", produto.findOne);
    router.post("/", produto.create);
    //PATCH para modificar certos dados
    router.patch("/", produto.update);
    router.delete("/", produto.delete);
    app.use("/kx/produtos", router);
}