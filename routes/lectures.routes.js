import express from 'express';
import multer from 'multer';
import path from 'path';
import Lecture from '../models/lecture.model.js';

const router = express.Router();

// 🗂️ إعداد تخزين الملفات
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

// ✅ إضافة محاضرة مع ملفات
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const { title, description, courseId, videoUrl, mp3Url } = req.body;
    const files = req.files?.map(file => file.filename) || [];

    const lecture = new Lecture({
      title,
      description,
      course: courseId,
      videoUrl,
      mp3Url,
      files
    });

    await lecture.save();
    res.status(201).json({ success: true, data: lecture });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to add lecture', error: err.message });
  }
});

// ✅ جلب المحاضرات حسب معرف الكورس
router.get('/course/:courseId', async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.courseId });
    res.json({ success: true, data: lectures });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch lectures', error: err.message });
  }
});
// ✅ الحصول على محاضرة واحدة للتعديل
router.get('/:id', async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }
    res.json({ success: true, data: lecture });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get lecture' });
  }
});
// ✅ Get single lecture
router.get('/:id', async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });
  res.json({ success: true, data: lecture });
});

// ✅ Update lecture
router.put('/:id', upload.array('files'), async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      videoUrl: req.body.videoUrl,
      mp3Url: req.body.mp3Url,
      $push: {
        files: { $each: req.files.map(file => file.filename) }
      }
    }, { new: true });

    res.json({ success: true, data: lecture });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});


export default router;
