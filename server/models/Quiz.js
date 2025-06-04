// server/models/Quiz.js

const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    grade: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [
          {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true }
          }
        ]
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);