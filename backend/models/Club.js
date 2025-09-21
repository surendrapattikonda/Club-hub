const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },

  // Multiple leads
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Membership
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // join requests

  // Faculty advisor (optional, for oversight)
  facultyAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update `updatedAt`
clubSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Club", clubSchema);
