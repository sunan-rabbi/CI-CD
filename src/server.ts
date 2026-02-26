import { Server } from 'http';
import { AddressInfo } from 'net';
import app from './app';

let server: Server;

async function bootstrap() {
  try {


    server = app.listen(5000, () => {

      const address = server.address() as AddressInfo;

      console.log(`
        🚀 Server ready at http://localhost:${address.port}
        🔧 Environment: Productionn
        📅 Started: ${new Date().toISOString()}
      `);
    });


    server.on('error', (error: Error) => {
      console.log('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.log('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown(signal: string) {

  console.log(`${signal} received. Starting graceful shutdown...`);

  if (server) {

    server.close(async () => {

      console.log('HTTP server closed');
      console.log('Graceful shutdown completed');
      process.exit(0);

    });


    setTimeout(() => {

      console.log('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  }
}

// Error handlers
process.on('uncaughtException', (error: Error) => {
  console.log('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
bootstrap().catch((error) => {
  console.log('Bootstrap failed:', error);
  process.exit(1);
});