import Course from "../models/course.model.js";

const createCourse = async (req, res) => {
  try {
    const { title, category, description, instructor } = req.body;

    // تحقق من وجود instructor
    if (!instructor) {
      return res.status(400).json({ success: false, message: "Instructor ID is required." });
    }

    const course = new Course({
      title,
      category,
      description,
      instructor,
    });

    await course.save();

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default {
  createCourse,
};
