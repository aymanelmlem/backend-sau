import Employee from '../models/Employee.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'You cannot register as superadmin' });
    }

    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const employee = new Employee({ name, email, password, role, isActive: false });
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Account created. Waiting for superadmin approval.',
      data: { id: employee._id, name: employee.name, email: employee.email, role: employee.role, isActive: employee.isActive }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const match = await employee.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!employee.isActive) {
      return res.status(403).json({ success: false, message: 'Account not yet approved by superadmin' });
    }

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: { id: employee._id, name: employee.name, email: employee.email, role: employee.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};