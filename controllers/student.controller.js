import Student from '../models/student.model.js';

// ➕ تسجيل طالب جديد
export const signupStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Signup failed', error: err.message });
  }
};

// 🔐 تسجيل الدخول
export const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });

  if (!student || student.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!student.isApproved) {
    return res.status(403).json({ success: false, message: 'Your account is pending approval.' });
  }

  res.json({ success: true, data: student });
};

// 📚 جلب بيانات طالب
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('enrolledCourses');
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(404).json({ success: false, message: 'Student not found' });
  }
};

// ✅ جلب الطلاب غير المفعلين
export const getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await Student.find({ isApproved: false });
    res.json({ success: true, data: pendingStudents });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending students' });
  }
};

// ✅ الموافقة على طالب
export const approveStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student approved', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Approval failed' });
  }
};
