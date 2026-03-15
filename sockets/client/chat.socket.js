const Chat = require("../../models/chat.model");

module.exports = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content
      });
      await chat.save();

      _io.emit("SERVER_SEND_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: content
      });
    });
  });
};
