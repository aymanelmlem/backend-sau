// routes/enrollments.routes.js
import express from 'express';
import Enrollment from '../models/enrollment.model.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { course, student } = req.body;

    if (!course || !student) {
      return res.status(400).json({ success: false, message: 'Course and student are required' });
    }

    const enrollment = new Enrollment({ course, student });
    await enrollment.save();
    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    console.error('Enrollment error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
