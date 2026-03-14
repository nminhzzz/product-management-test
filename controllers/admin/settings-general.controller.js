const { prefixAdmin } = require("../../config/system");
const SettingGeneral = require("../../models/setting-general.model");

module.exports.general = async (req, res) => {
  const setting = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    setting: setting,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const setting = await SettingGeneral.findOne({});

  if (setting) {
    await SettingGeneral.updateOne(
      {
        _id: setting.id,
      },
      req.body,
    );
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhật thành công");

  res.redirect(`${prefixAdmin}/settings/general`);
};
