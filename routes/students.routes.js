import express from 'express';
import Student from '../models/student.model.js';

const router = express.Router();

// ➕ تسجيل طالب جديد
router.post('/signup', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Signup failed', error: err.message });
  }
});

// 🔐 تسجيل الدخول
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });

  if (!student || student.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({ success: true, data: student });
});

export default router;
