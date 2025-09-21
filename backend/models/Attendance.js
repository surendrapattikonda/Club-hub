const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  date: { type: Date, default: Date.now },
  presentMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
 { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
