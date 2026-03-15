const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  _io.once("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({ user_id: userId, content: content });
      await chat.save();
    });
  });
  // lấy data từ database ra
  const chats = await Chat.find({ deleted: false });
  for (const chat of chats) {
    const infoUser = await User.find({ _id: chat.user_id }).select("fullName");
    chat.infoUser = infoUser;
  }
  res.render("client/pages/chat/index", { chats: chats });
};
