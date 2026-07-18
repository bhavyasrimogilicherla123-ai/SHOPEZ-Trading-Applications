const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const { env } = require('./src/config/env');
const mongoose = require('mongoose');

let server;
const start = async () => {
  await connectDatabase();
  server = app.listen(env.port, () => {
    console.log(`SHOPEZ API listening on port ${env.port}`);
  });
};

function shutdown(signal) {
  console.log(`${signal} received; closing SHOPEZ server.`);
  const finish = () => mongoose.disconnect().catch(() => {}).finally(() => process.exit(0));
  if (!server) return finish();
  server.close(finish);
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((error) => {
  console.error('Unable to start SHOPEZ API:', error.message);
  process.exit(1);
});
