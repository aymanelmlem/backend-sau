import express from 'express';
import multer from 'multer';
import path from 'path';
import Student from '../models/student.model.js';
import Course from '../models/course.model.js';
import Lecture from '../models/lecture.model.js';

const router = express.Router();

// ✅ إعداد تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ✅ تسجيل طالب في كورس
router.post('/students/enroll', async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    if (!student || !course) {
      return res.status(404).json({ success: false, message: 'Student or Course not found' });
    }
    if (student.courses.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Student already enrolled' });
    }
    student.courses.push(courseId);
    await student.save();
    res.json({ success: true, message: 'Student enrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Enrollment failed', error: err.message });
  }
});

// ✅ جلب الطلاب المفعلين
router.get('/students/approved', async (req, res) => {
  try {
    const students = await Student.find({ isApproved: true });
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch students', error: err.message });
  }
});

// ✅ رفع محاضرة مع ملفات
router.post('/lectures/upload', upload.array('files'), async (req, res) => {
  try {
    const { title, videoUrl, description } = req.body;
    const files = req.files.map(file => file.filename);

    const lecture = new Lecture({
      title,
      videoUrl,
      description,
      files
    });

    await lecture.save();
    res.json({ success: true, message: 'Lecture uploaded', data: lecture });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lecture upload failed', error: err.message });
  }
});

export default router;
