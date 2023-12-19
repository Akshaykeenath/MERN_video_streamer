const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fname: String,
  lname: String,
  uname: String,
  mobile: Number,
  email: String,
  password: String,
  verified: Boolean,
  channel: {
    name: String,
    img: [
      {
        size: String,
        url: String,
        firebaseUrl: String,
      },
    ],
    subscribers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "userdata" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
});

module.exports = mongoose.model("userdata", userSchema);
