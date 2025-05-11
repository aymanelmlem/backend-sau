import express from 'express';
import { createCourse, getCoursesByInstructor, getAllCourses } from '../controllers/course.controller.js';

const router = express.Router();

// 📥 كل الكورسات (اختياري إذا كنت تحتاجه)
router.get('/', getAllCourses);

// 📥 كورسات محاضر محدد
router.get('/instructor/:instructorId', getCoursesByInstructor);

// ➕ إضافة كورس جديد
router.post('/', createCourse);

export default router;
