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

  if (!student.isApproved) {
    return res.status(403).json({ success: false, message: 'Account not approved yet' });
  }

  res.json({ success: true, data: student });
});

// ✅ جلب كل الطلاب المفعلين فقط
router.get('/approved', async (req, res) => {
  try {
    const approvedStudents = await Student.find({ isApproved: true });
    res.json({ success: true, data: approvedStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch approved students', error: error.message });
  }
});

export default router;
