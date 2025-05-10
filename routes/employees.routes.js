import express from 'express';
import bcrypt from 'bcryptjs'; // ✅ أضف هذا السطر
import Employee from '../models/Employee.js';

const router = express.Router();

// ✅ تسجيل الدخول مع التحقق من كلمة المرور المشفرة
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email, isApproved: true });

    if (!employee) {
      return res.status(401).json({ success: false, message: "Invalid credentials or not approved" });
    }

    // ✅ تحقق باستخدام bcrypt
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
});

// ✅ تسجيل مستخدم جديد مع تشفير كلمة المرور
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: false
    });

    await newEmployee.save();
    res.status(201).json({ success: true, data: newEmployee });
  } catch (err) {
    res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
});

// ✨ باقي المسارات (approve, get instructors, إلخ)... تبقى كما هي
// فقط تأكد أن هذا الملف يحتوي على كل المسارات التي أرسلناها سابقًا

export default router;
