import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['Basics', 'Advanced', 'Case Study'], // ✳️ يمكنك تعديل أو إضافة المزيد
    default: 'Basics'
  },
  videoUrl: {
    type: String
  },
  mp3Url: {
    type: String
  },
  files: [{
    type: String // اسم الملف أو رابط التخزين (مثلاً /uploads/lecture1.pdf)
  }],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;
