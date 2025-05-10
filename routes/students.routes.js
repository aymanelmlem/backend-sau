import express from "express";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";

const router = express.Router();

// ➕ تسجيل طالب جديد
router.post('/signup', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Signup failed',
      error: err.message
    });
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

// 🔗 تسجيل طالب في كورس
router.post("/enroll", async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ success: false, message: "Student or Course not found" });
    }

    if (student.courses.includes(courseId)) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    student.courses.push(courseId);
    await student.save();

    res.json({ success: true, message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Enrollment failed", error: err.message });
  }
});

export default router;
