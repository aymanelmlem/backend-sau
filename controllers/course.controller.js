import Course from "../models/course.model.js";

// ✅ إنشاء كورس جديد
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, instructorId } = req.body;

    // ✅ تحقق من الحقول المطلوبة
    if (!title || !category || !instructorId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ إنشاء الكورس
    const course = new Course({ title, description, category, instructorId });
    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    console.error("Error in createCourse:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ عرض كورسات محاضر محدد
export const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // ✅ البحث عن كورسات مرتبطة بـ instructorId
    const courses = await Course.find({ instructorId });

    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    console.error("Error in getCoursesByInstructor:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

