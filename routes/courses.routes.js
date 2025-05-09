import express from 'express';
import Course from '../models/course.model.js';

const router = express.Router();

// 📥 كل الكورسات
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📥 كورسات محاضر
router.get('/instructor/:id', async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ➕ إضافة كورس
router.post('/', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ success: true, data: newCourse });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
