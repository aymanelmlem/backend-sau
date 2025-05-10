import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// ✅ إعدادات CORS
app.use(cors({
  origin: 'https://smart-aura-frontend.vercel.app'
}));

app.use(express.json());

// ✅ تعريف مجلد public للملفات الثابتة إن لزم
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// ✅ استيراد الراوترات
import studentRoutes from './routes/students.routes.js';
import employeeRoutes from './routes/employees.routes.js';
import courseRoutes from './routes/courses.routes.js';
import instructorRoutes from './routes/instructor-routes.js'; // ✅ تم الإضافة هنا

// ✅ استخدام الراوترات
app.use('/api/students', studentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructor', instructorRoutes); // ✅ تمت إضافته هنا

// ✅ نقطة اختبار
app.get('/', (req, res) => {
  res.send('✅ Smart Aura Backend is running!');
});

// ✅ الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
