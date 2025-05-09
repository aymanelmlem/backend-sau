import Course from '../models/Course.js';

// ➕ إنشاء كورس جديد
export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, message: 'Course created', data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create course', error: err.message });
  }
};

// 📥 جلب الكورسات الخاصة بمحاضر
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: err.message });
  }
};

// ➕ إضافة محاضرة جديدة إلى كورس
export const addLectureToCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    course.lectures.push(req.body);
    await course.save();
    res.json({ success: true, message: 'Lecture added', data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add lecture', error: err.message });
  }
};

// 👁️ تحديث حالة ظهور المحاضرة
export const updateLectureVisibility = async (req, res) => {
  try {
    const { courseId, lectureIndex } = req.params;
    const { isVisible } = req.body;

    const course = await Course.findById(courseId);
    if (!course || !course.lectures[lectureIndex]) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }

    course.lectures[lectureIndex].isVisible = isVisible;
    await course.save();
    res.json({ success: true, message: 'Lecture visibility updated', data: course.lectures[lectureIndex] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update visibility', error: err.message });
  }
};

// 🎓 تسجيل طالب في كورس
export const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.courseId);

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      course.enrollmentsCount += 1;
      await course.save();
    }

    res.json({ success: true, message: 'Student enrolled', data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Enrollment failed', error: err.message });
  }
};