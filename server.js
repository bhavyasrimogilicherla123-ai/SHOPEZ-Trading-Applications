const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const { env } = require('./src/config/env');

const start = async () => {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`SHOPEZ API listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error('Unable to start SHOPEZ API:', error.message);
  process.exit(1);
});
