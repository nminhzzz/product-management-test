const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/chat.controller");
console.log(typeof controller.index);
route.get("/", controller.index);

module.exports = route;
