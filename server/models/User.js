const mongoose = require('mongoose');

// 1. Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'admin'],
      default: 'student'
    },
    grade: {
      type: Number,
      // Only students need a grade (e.g., 7 for 7th grade).
      required: function () {
        return this.role === 'student';
      }
    },
    // If the user is a parent, you can store which student(s) they own:
    childOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.role === 'parent';
      }
    }
  },
  { timestamps: true }
);

// 2. Export the model
module.exports = mongoose.model('User', userSchema);
