import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from './routes/authRoutes';
import { authenticateJWT } from './middleware/authMiddleware';
import { roleGuard } from './middleware/roleGuard';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Finance Dashboard API is running gracefully.",
  });
});

app.use('/api/auth', authRoutes);

app.get('/api/test-admin', authenticateJWT, roleGuard(['ADMIN']), (req, res) => {
  res.status(200).json({ message: 'Success! You have passed the bouncers as an ADMIN.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
