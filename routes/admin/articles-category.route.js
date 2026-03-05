const express = require("express");
const route = express.Router();
const controllers = require("../../controllers/admin/articles-category.controller");
const validate = require("../../validates/admin/products-category.validate");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

route.get("/", controllers.index);
route.get("/create", controllers.create);
route.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controllers.createPost,
);
route.patch("/change-status/:status/:id", controllers.changeStatus);
route.patch("/change-multi", controllers.changeMulti);
route.get("/detail/:id", controllers.detail);
route.delete("/delete/:id", controllers.delete);
route.get("/edit/:id", controllers.edit);
route.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controllers.editPatch,
);

module.exports = route;
