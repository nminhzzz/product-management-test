const express = require("express");
const multer = require("multer");

const controller = require("../../controllers/admin/products.controller");
const storageMulter = require("../../helpers/storageMulter");
const route = express.Router();
const upload = multer({ storage: storageMulter() });

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", controller.products);
route.patch("/change-status/:status/:id", controller.changeStatus);
route.delete("/delete/:id", controller.delete);
route.get("/create", controller.create);
route.post("/create", upload.single("thumbnail"), controller.createPost);

route.patch("/change-multi", controller.changeMulti);

module.exports = route;
