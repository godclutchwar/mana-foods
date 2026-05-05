const serverless = require('serverless-http');
const app = require('./backend/app');
const { initDb } = require('./backend/db');

// Initialize database (run migrations/table creation)
// Note: In serverless, this might run multiple times. 
// A better approach is to use a separate migration script, 
// but for "mimicry" and simplicity we'll try to ensure tables exist.
let isInit = false;
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  if (!isInit) {
    try {
      await initDb();
      isInit = true;
    } catch (err) {
      console.error('DB Init Error:', err);
    }
  }
  return await handler(event, context);
};
