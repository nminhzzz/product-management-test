const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/cart.controller");
route.post("/add/:productId", controller.add);
route.get("/", controller.index);
route.get("/delete/:productId", controller.delete);

module.exports = route;
