const express = require("express");
const controller = require("../../controllers/admin/dashboard.controller");

const route = express.Router();

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", controller.dashboard);

module.exports = route;
