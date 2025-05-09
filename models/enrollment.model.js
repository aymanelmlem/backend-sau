import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
