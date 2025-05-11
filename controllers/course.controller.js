import Course from '../models/course.model.js';

// 📌 إنشاء كورس جديد
export const createCourse = async (req, res) => {
  try {
    const { title, category, description, instructorId } = req.body;

    // ✅ تحقق من وجود instructorId
    if (!instructorId) {
      return res.status(400).json({ success: false, message: "Missing instructorId" });
    }

    const course = new Course({
      title,
      category,
      description,
      instructorId
    });

    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 الحصول على كورسات محاضر معين
export const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const courses = await Course.find({ instructorId });
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✳️ باقي الدوال حسب الحاجة...
