import Course from "../models/course.model.js";

// ✅ إنشاء كورس جديد
export const createCourse = async (req, res) => {
  try {
    const { title, category, description, instructor } = req.body;

    if (!title || !category || !instructor) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const course = new Course({ title, category, description, instructor });
    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ جلب جميع الكورسات
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ كورسات محاضر معين
export const getCoursesByInstructor = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const courses = await Course.find({ instructor: instructorId });
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
