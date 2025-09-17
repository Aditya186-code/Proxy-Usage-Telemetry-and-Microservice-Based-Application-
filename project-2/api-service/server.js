const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'database',
  database: process.env.DB_NAME || 'myapp',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Redis connection
const redisClient = redis.createClient({
  url: process.env.QUEUE_URL || 'redis://queue:6379'
});

// Connect to Redis
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(() => console.log('Connected to Redis'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Create job endpoint
app.post('/jobs', async (req, res) => {
  const { title } = req.body;
  try {
    // Insert job into database
    const result = await pool.query(
      'INSERT INTO jobs (title, status) VALUES ($1, $2) RETURNING *',
      [title, 'pending']
    );
    
    const job = result.rows[0];
    
    // Push job to Redis queue
    await redisClient.lPush('jobs', JSON.stringify({
      id: job.id,
      title: job.title
    }));
    
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Get jobs endpoint
app.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API service running on port ${PORT}`);
});