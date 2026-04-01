import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from './features/auth/routes/authRoutes';
import transactionRoutes from "./routes/transactionRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { errorHandler } from "./middleware/errorHandler";

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

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
