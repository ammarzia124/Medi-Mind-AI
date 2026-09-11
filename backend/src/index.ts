import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: Add route handlers
// app.use('/api/auth', authRoutes);
// app.use('/api/symptoms', symptomRoutes);
// app.use('/api/lab', labRoutes);
// app.use('/api/timeline', timelineRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🏥 MediMind AI Backend running on port ${PORT}`);
});

export default app;
