import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// تحميل متغيرات البيئة
dotenv.config();
const app = express();

// إعداد المسارات الثابتة
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد CORS
app.use(cors({ origin: '*' }));
app.options('*', cors());

// استقبال JSON
app.use(express.json());

// ✅ استيراد الراوترات قبل أي static files
import employeeRoutes from './routes/employees.routes.js';
import studentRoutes from './routes/students.routes.js';
import courseRoutes from './routes/courses.routes.js';
import instructorRoutes from './routes/instructor-routes.js';
import lectureRoutes from './routes/lectures.routes.js';

// ✅ نقاط الـ API (يجب أن تأتي أولاً)
app.use('/api/employees', employeeRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes); // ⬅ هذا هو المطلوب من المتصفح
app.use('/api/instructor', instructorRoutes);
app.use('/api/instructor', lectureRoutes);

// ✅ لتقديم ملفات المحاضرات
app.use('/uploads', express.static('uploads'));

// ❗️❗️ لا تقم بتقديم مجلد public بشكل عام إذا لم يكن يحتوي على index.html مخصص للبروجيكت
// app.use(express.static(path.join(__dirname, 'public'))); ← إنزع التعليق فقط لو فيه frontend

// نقطة فحص بسيطة
app.get('/', (req, res) => {
  res.send('✅ Smart Aura Backend is running and ready!');
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
