import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ تحميل متغيرات البيئة
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ✅ المسارات
import employeeRoutes from './routes/employees.routes.js';
import courseRoutes from './routes/courses.routes.js';
import lectureRoutes from './routes/lectures.routes.js';

app.use('/api/employees', employeeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);

// ✅ تعريف مجلد public ليخدم صفحات HTML
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// ✅ نقطة البداية الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'instructor-portal.html'));
});

// ✅ الاتصال بقاعدة البيانات
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
