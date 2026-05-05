const app = require('./app');
const { initDb } = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

initDb().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database, running with limited functionality', err.message);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
