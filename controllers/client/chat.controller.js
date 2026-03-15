const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const chatSocket = require("../../sockets/client/chat.socket");

module.exports.index = async (req, res) => {
  // Socket.io
  chatSocket(req, res);
  // End Socket.io

  // lấy data từ database ra
  const chats = await Chat.find({ deleted: false }).lean();
  for (const chat of chats) {
    const infoUser = await User.findOne({ _id: chat.user_id }).select(
      "fullName"
    ).lean();
    chat.infoUser = infoUser;
  }
  res.render("client/pages/chat/index", { chats: chats });
};
