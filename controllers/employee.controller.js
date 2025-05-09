import Employee from '../models/Employee.js';
import bcrypt from 'bcryptjs';

// تسجيل موظف جديد
export const signup = async (req, res) => {
  try {
    const existing = await Employee.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Signup failed', error: err.message });
  }
};

// تسجيل الدخول
export const login = async (req, res) => {
  const { email, password } = req.body;
  const employee = await Employee.findOne({ email });

  if (!employee) {
    return res.status(404).json({ success: false, message: 'Employee not found' });
  }

  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  if (!employee.isApproved) {
    return res.status(403).json({ success: false, message: 'Account not approved yet' });
  }

  res.json({ success: true, data: { id: employee._id, name: employee.name, role: employee.role } });
};

// تفعيل موظف
export const activateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Activation failed' });
  }
};

// جلب الموظفين غير المفعلين
export const getPendingEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isApproved: false });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending employees' });
  }
};

// ✅ جلب الموظفين المفعلين
export const getActiveEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isApproved: true });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch active employees' });
  }
};
