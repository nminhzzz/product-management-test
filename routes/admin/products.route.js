const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/products.controller");
// const storageMulter = require("../../helpers/storageMulter");
const route = express.Router();
const upload = multer();

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", controller.products);
route.patch("/change-status/:status/:id", controller.changeStatus);
route.delete("/delete/:id", controller.delete);
route.get("/create", controller.create);
route.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createPost
);
route.get("/edit/:id", controller.edit);
route.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPost
);

route.patch("/change-multi", controller.changeMulti);
route.get("/detail/:id", controller.detail);

module.exports = route;
