import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

// ✅ جلب المحاضرين غير المفعلين
router.get("/pending/instructor", async (req, res) => {
  try {
    const pending = await Employee.find({ role: "instructor", isApproved: false });
    res.json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load instructors", error: err.message });
  }
});

// ✅ جلب الإداريين غير المفعلين
router.get("/pending/admin", async (req, res) => {
  try {
    const pending = await Employee.find({ role: "admin", isApproved: false });
    res.json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load admins", error: err.message });
  }
});

// ✅ تفعيل حساب محاضر
router.patch("/approve/instructor/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to approve instructor", error: err.message });
  }
});

// ✅ تفعيل حساب إداري
router.patch("/approve/admin/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to approve admin", error: err.message });
  }
});

// ✅ جلب المحاضرين المفعلين
router.get("/approved/instructor", async (req, res) => {
  try {
    const approved = await Employee.find({ role: "instructor", isApproved: true });
    res.json({ success: true, data: approved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load approved instructors", error: err.message });
  }
});

router.get("/approved/admin", async (req, res) => {
  try {
    const approved = await Employee.find({ role: "admin", isApproved: true });
    res.json({ success: true, data: approved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load approved admins", error: err.message });
  }
});

router.get("/approved/student", async (req, res) => {
  try {
    const approved = await Employee.find({ role: "student", isApproved: true });
    res.json({ success: true, data: approved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load approved students", error: err.message });
  }
});

// ✅ تسجيل حساب موظف جديد
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const newEmployee = new Employee({ name, email, password, role, isApproved: false });
    await newEmployee.save();

    res.status(201).json({ success: true, data: newEmployee });
  } catch (err) {
    res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
});

// ✅ تسجيل الدخول بدون تشفير
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email, isApproved: true });

    if (!employee || employee.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials or not approved" });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
});

export default router;
