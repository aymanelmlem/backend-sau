import express from 'express';
import { createCourse, getCoursesByInstructor, getAllCourses } from '../controllers/course.controller.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/instructor/:id', getCoursesByInstructor);
router.post('/', createCourse);

export default router;
