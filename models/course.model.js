// models/course.model.js

import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  isVisible: {
    type: Boolean,
    default: true // ✅ الكورس ظاهر افتراضياً عند إنشائه
  }
});

export default mongoose.model('Course', courseSchema);
