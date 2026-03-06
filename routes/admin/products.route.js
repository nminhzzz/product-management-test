const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/products.controller");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
// const storageMulter = require("../../helpers/storageMulter");
const route = express.Router();
const upload = multer();

// Dùng "/" rõ ràng để đảm bảo map đúng root
route.get("/", authMiddleware.requirePermission("products_view"), controller.products);
route.patch("/change-status/:status/:id", authMiddleware.requirePermission("products_edit"), controller.changeStatus);
route.delete("/delete/:id", authMiddleware.requirePermission("products_delete"), controller.delete);
route.get("/create", authMiddleware.requirePermission("products_create"), controller.create);
route.post(
  "/create",
  authMiddleware.requirePermission("products_create"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createPost
);
route.get("/edit/:id", authMiddleware.requirePermission("products_edit"), controller.edit);
route.patch(
  "/edit/:id",
  authMiddleware.requirePermission("products_edit"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPost
);

route.patch("/change-multi", authMiddleware.requirePermission("products_edit"), controller.changeMulti);
route.get("/detail/:id", authMiddleware.requirePermission("products_view"), controller.detail);

module.exports = route;
