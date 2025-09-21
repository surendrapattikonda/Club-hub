const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  regNo: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  year: {
  type: String,
  enum: ['1st', '2nd', '3rd', '4th', 'N/A'],
  required: true
}
,
  role: {
    type: String,
    enum: ['student', 'faculty', 'clublead', 'admin'], 
    default: 'student'
  },
  clubs: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Club', default: null }
  ]
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
