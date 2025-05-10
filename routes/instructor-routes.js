// ✅ instructor_routes_backend.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Lecture from '../models/lecture.model.js';
import Student from '../models/student.model.js';
import Course from '../models/course.model.js';

const router = express.Router();

// ✅ إعداد Multer لتخزين الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join('uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ رفع محاضرة جديدة
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const { title, videoUrl, description, courseId } = req.body;
    const files = req.files.map(f => f.filename);

    const lecture = new Lecture({
      title,
      videoUrl,
      description,
      courseId,
      files
    });

    await lecture.save();
    res.status(201).json({ success: true, data: lecture });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to save lecture', error: err.message });
  }
});

// ✅ جلب الطلاب المفعلين
router.get('/approved-students', async (req, res) => {
  try {
    const approvedStudents = await Student.find({ isApproved: true });
    res.json({ success: true, data: approvedStudents });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load students', error: err.message });
  }
});

// ✅ تسجيل طالب في كورس معين بواسطة المحاضر
router.post('/enroll-student', async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ success: false, message: 'Student or Course not found' });
    }

    if (student.courses.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Student already enrolled in this course' });
    }

    student.courses.push(courseId);
    await student.save();

    res.json({ success: true, message: 'Student enrolled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Enrollment failed', error: err.message });
  }
});

export default router;
