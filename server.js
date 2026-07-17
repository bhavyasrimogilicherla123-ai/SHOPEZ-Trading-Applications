const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const { env } = require('./src/config/env');

let server;
const start = async () => {
  await connectDatabase();
  server = app.listen(env.port, () => {
    console.log(`SHOPEZ API listening on port ${env.port}`);
  });
};

function shutdown(signal) {
  console.log(`${signal} received; closing SHOPEZ server.`);
  if (!server) return process.exit(0);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((error) => {
  console.error('Unable to start SHOPEZ API:', error.message);
  process.exit(1);
});
