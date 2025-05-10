import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// ✅ تحميل متغيرات البيئة من .env
dotenv.config();

const app = express();

// ✅ إعدادات CORS مخصصة لـ Vercel فقط
app.use(cors({
  origin: "https://smart-aura-frontend.vercel.app"
}));

app.use(express.json());

// ✅ استيراد المسارات (Routes)
import employeeRoutes from './routes/employees.routes.js';
import courseRoutes from './routes/courses.routes.js';
import lectureRoutes from './routes/lectures.routes.js';

app.use('/api/employees', employeeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);

// ✅ نقطة اختبار الاتصال (homepage)
app.get('/', (req, res) => {
  res.send('✅ Smart Aura Backend is running!');
});

// ✅ الاتصال بقاعدة البيانات MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
