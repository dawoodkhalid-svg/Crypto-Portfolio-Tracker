// Load environment variables
require('dotenv').config();

// Import database configuration
const mongoose = require('./server/config/db');

// Import Express app configuration
const app = require('./server/config/app');

// Set port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});