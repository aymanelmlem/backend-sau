import Course from '../models/course.model.js';

// ✅ إنشاء كورس جديد
export const createCourse = async (req, res) => {
  try {
    const { title, description, isVisible, instructorId } = req.body;

    if (!instructorId) {
      return res.status(400).json({ success: false, message: 'Instructor ID is required' });
    }

    const course = new Course({
      title,
      description,
      isVisible,
      instructor: instructorId
    });

    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    console.error('❌ Error creating course:', err);
    res.status(500).json({ success: false, message: 'Failed to create course', error: err.message });
  }
};

// ✅ جلب الكورسات الخاصة بمحاضر معين
export const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.query;

    if (!instructorId) {
      return res.status(400).json({ success: false, message: 'Instructor ID is required' });
    }

    const courses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: err.message });
  }
};
