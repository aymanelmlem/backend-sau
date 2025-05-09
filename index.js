import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// ✅ تحميل متغيرات البيئة
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ المسارات
import employeeRoutes from './routes/employees.routes.js';
import courseRoutes from './routes/courses.routes.js';
import lectureRoutes from './routes/lectures.routes.js';

app.use('/api/employees', employeeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);

// ✅ اختبار بسيط للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.send('✅ Smart Aura Backend is running!');
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
