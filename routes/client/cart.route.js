const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/cart.controller");
route.post("/add/:productId", controller.add);
route.get("/", controller.index);
route.get("/delete/:productId", controller.delete);
route.get("/update/:productId/:newQuantity", controller.update);

module.exports = route;
