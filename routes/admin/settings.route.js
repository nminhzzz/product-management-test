const express = require("express");
const validate = require("../../validates/admin/auth.validate");
const controller = require("../../controllers/admin/settings-general.controller");
const multer = require("multer");
const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const route = express.Router();
route.get("/general", controller.general);
route.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.generalPatch,
);

module.exports = route;
