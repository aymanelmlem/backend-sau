import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// تحميل متغيرات البيئة
dotenv.config();
const app = express();

// إعداد CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// استقبال JSON في الطلبات
app.use(express.json());

// إعداد static files (الملفات الثابتة)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// ✅ لتقديم ملفات المحاضرات (PDF/MP4/Docs)
app.use('/uploads', express.static('uploads'));

// استيراد الراوترات
import employeeRoutes from './routes/employees.routes.js';
import studentRoutes from './routes/students.routes.js';
import courseRoutes from './routes/courses.routes.js';
import instructorRoutes from './routes/instructor-routes.js';
import lectureRoutes from './routes/lectures.routes.js';

// تفعيل الراوترات
app.use('/api/employees', employeeRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructor', instructorRoutes); // لإدارة الكورسات والطلاب
app.use('/api/instructor', lectureRoutes);    // لرفع المحاضرات

// نقطة اختبار للتأكد من تشغيل السيرفر
app.get('/', (req, res) => {
  res.send('✅ Smart Aura Backend is running!');
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
