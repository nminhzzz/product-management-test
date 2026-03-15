module.exports.index = async (req, res) => {
  _io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  });
  res.render("client/pages/chat/index");
};
