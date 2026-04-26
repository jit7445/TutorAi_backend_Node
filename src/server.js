const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.port, () => {
  console.log(`
    🚀 Server is running!
    PORT: ${config.port}
    ENV: ${config.env}
    URL: http://localhost:${config.port}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
