import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String
  },
  description: {
    type: String
  },
  files: [{
    type: String  // سيتم حفظ اسم الملفات هنا فقط
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;
