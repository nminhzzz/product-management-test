const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/accounts.controller");
const upload = multer();
const validate = require("../../validates/admin/products-category.validate");
const route = express.Router();
route.get("/", controller.index);
route.get("/create", controller.create);
route.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.createPost,
);
route.get("/edit/:id", controller.edit);
route.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch,
);
module.exports = route;
