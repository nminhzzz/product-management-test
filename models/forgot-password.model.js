const mongoose = require("mongoose");
const ForgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      // Sử dụng thuộc tính expires của Mongoose, đếm chuẩn số giây kể từ thời điểm tạo (mặc định là current Date).
      // Nhưng Mongoose sẽ tự hiểu là tính thời gian từ "hiện tại".
      expires: "1m", // Hoặc để số  60 (tức là 60 giây). Dùng 10s quá ngắn đôi khi Mongoose/MongoDB skip qua.
    },
  },
  {
    timestamps: true,
  },
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  ForgotPasswordSchema,
  "forgot-password",
);

module.exports = ForgotPassword;
