import express from 'express';
import multer from 'multer';
import path from 'path';
import Lecture from '../models/lecture.model.js';

const router = express.Router();

// إعداد تخزين الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // تأكد من وجود هذا المجلد في جذر المشروع
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// ✅ رفع محاضرة جديدة
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      videoUrl,
      mp3Url,
      courseId
    } = req.body;

    const fileNames = req.files.map(file => file.filename);

    const lecture = new Lecture({
      title,
      description,
      category,
      videoUrl,
      mp3Url,
      files: fileNames,
      courseId
    });

    await lecture.save();
    res.status(201).json({ success: true, data: lecture });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: 'Lecture upload failed', error: err.message });
  }
});

export default router;
