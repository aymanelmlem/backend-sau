import express from 'express'; // ✅ هذا السطر ناقص في كودك
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
    const updated = await Employee.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to approve instructor", error: err.message });
  }
});

// ✅ تفعيل حساب إداري
router.patch("/approve/admin/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to approve admin", error: err.message });
  }
});

export default router;
