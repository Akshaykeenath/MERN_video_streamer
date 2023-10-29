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
});

module.exports = mongoose.model("userdata", userSchema);
