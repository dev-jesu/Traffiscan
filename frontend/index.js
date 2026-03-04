import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Traffiscan API is running' });
});

// Detection stats endpoint (mock data)
app.get('/api/stats', (req, res) => {
  res.json({
    noHelmet: {
      today: 128,
      weekly: 876,
      monthly: 3245
    },
    phoneUsage: {
      today: 204,
      weekly: 1342,
      monthly: 5120
    },
    tripleRiding: {
      today: 57,
      weekly: 342,
      monthly: 1278
    },
    wrongWay: {
      today: 42,
      weekly: 294,
      monthly: 1105
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;