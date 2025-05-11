import express from 'express';
import {
  createCourse,
  getCoursesByInstructor,
  getAllCourses
} from '../controllers/course.controller.js';

const router = express.Router();

// ✅ كل الكورسات (اختياري)
router.get('/', getAllCourses);

// ✅ كورسات محاضر
router.get('/instructor/:instructorId', getCoursesByInstructor);

// ✅ إضافة كورس
router.post('/', createCourse);

export default router;
