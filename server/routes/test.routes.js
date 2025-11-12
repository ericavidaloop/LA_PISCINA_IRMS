const express = require('express');
const router = express.Router();

// Basic backend test
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is running!', 
    timestamp: new Date(),
    status: 'ok'
  });
});

// Database connection test
router.get('/test/database', async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Test 1: Check database connection
    const [tables] = await db.query('SHOW TABLES');
    
    // Test 2: Get users from database
    const [users] = await db.query(
      'SELECT id, email, first_name, last_name, role FROM users LIMIT 10'
    );

    res.json({
      success: true,
      message: 'Database connected successfully',
      tableCount: tables.length,
      users: users,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Database connection failed'
    });
  }
});

module.exports = router;