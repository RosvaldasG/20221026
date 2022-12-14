const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, min: 3 },
  email: { type: String, required: true, min: 3 },
  taskIds: { type: Array },
  totalTasksDone: { type: Number },
  password: { type: String, required: true, min: 15 },
  reg_timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
