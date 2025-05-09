import express from 'express';
import {
  signup,
  login,
  activateEmployee,
  getPendingEmployees,
  getActiveEmployees
} from '../controllers/employee.controller.js';

import Employee from '../models/Employee.js';

const router = express.Router();

// 🔐 تسجيل موظف جديد
router.post('/signup', signup);

// 🔐 تسجيل الدخول
router.post('/login', login);

// ✅ تفعيل موظف بواسطة المشرف الأعلى
router.patch('/activate/:id', activateEmployee);

// 🕒 عرض الموظفين غير المفعلين
router.get('/pending', getPendingEmployees);

// ✅ عرض الموظفين المفعّلين فقط
router.get('/active', getActiveEmployees);

// 🧪 جلب كل الموظفين (للتجربة فقط)
router.get('/all', async (req, res) => {
  try {
    const employees = await Employee.find();
    const formatted = employees.map(emp => ({
      id: emp._id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      isApproved: emp.isApproved
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: '❌ Failed to fetch employees' });
  }
});

export default router;
