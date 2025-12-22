const express = require("express");
const controller = require("../../controllers/client/home.controller");

const route = express.Router();

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", controller.index);

module.exports = route;
