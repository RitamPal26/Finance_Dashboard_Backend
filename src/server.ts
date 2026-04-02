import app from './app';
import { env } from './config/env';
import prisma from './config/db';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

const shutdown = async (signal: string) => {
  console.info(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.info('HTTP server closed.');

    try {
      await prisma.$disconnect();
      console.info('Database connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during database disconnection:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Forcing shutdown after 10s timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
