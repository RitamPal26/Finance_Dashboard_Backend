import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import rateLimit from 'express-rate-limit';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import authRoutes from './features/auth/routes/authRoutes';
import transactionRoutes from './features/transactions/routes/transactionRoutes';
import dashboardRoutes from './features/dashboard/routes/dashboardRoutes';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './features/users/routes/userRoutes';

const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

const allowedOrigins = env.ALLOWED_ORIGINS.split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(helmet());
app.use(express.json());
app.use(errorHandler);
app.use('/api', limiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Finance Dashboard API is running gracefully.',
  });
});
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

export default app;
