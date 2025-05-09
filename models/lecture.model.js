import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  files: [{ type: String }], // روابط الملفات (PDF, PPT, MP4...)
  createdAt: { type: Date, default: Date.now }
});

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;
