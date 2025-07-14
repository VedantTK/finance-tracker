const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Hardcoded configuration
const EXCHANGE_API_KEY = '9a761cd3806584a1bc2af5ee';
const DB_CONFIG = {
  user: 'financeuser',
  host: 'postgres',
  database: 'financedb',
  password: 'password123',
  port: 5432,
};

const pool = new Pool(DB_CONFIG);

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Finance Tracker API is running' });
});

// Get exchange rate
app.get('/exchange-rate', async (req, res) => {
  const { from, to } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'Both from and to currencies are required' });
  }

  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/${from}/${to}`
    );
    
    if (response.data.result === 'success') {
      res.json({
        from,
        to,
        rate: response.data.conversion_rate,
        last_updated: response.data.time_last_update_utc
      });
    } else {
      res.status(400).json({ error: 'Invalid currency pair' });
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

// Add transaction
app.post('/transactions', async (req, res) => {
  const { userId, amount, category, currency, date } = req.body;

  if (!userId || !amount || !category || !currency || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // First, ensure the category exists
    const categoryResult = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
      [category]
    );

    let categoryId;
    if (categoryResult.rows.length > 0) {
      categoryId = categoryResult.rows[0].id;
    } else {
      const existingCategory = await pool.query(
        'SELECT id FROM categories WHERE name = $1',
        [category]
      );
      categoryId = existingCategory.rows[0].id;
    }

    // Insert transaction
    const result = await pool.query(
      'INSERT INTO transactions (user_id, category_id, amount, currency, timestamp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, categoryId, amount, currency, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Get transactions for a specific month
app.get('/transactions', async (req, res) => {
  const { month } = req.query; // Expected format: YYYY-MM

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required (YYYY-MM format)' });
  }

  try {
    const result = await pool.query(`
      SELECT t.id, t.amount, t.currency, t.timestamp, c.name as category
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE DATE_TRUNC('month', t.timestamp) = DATE_TRUNC('month', $1::date)
      ORDER BY t.timestamp DESC
    `, [month + '-01']);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get spending report for a specific month
app.get('/spending-report', async (req, res) => {
  const { month } = req.query; // Expected format: YYYY-MM

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required (YYYY-MM format)' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        c.name as category,
        SUM(t.amount) as total_amount,
        COUNT(t.id) as transaction_count
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE DATE_TRUNC('month', t.timestamp) = DATE_TRUNC('month', $1::date)
      GROUP BY c.name
      ORDER BY total_amount DESC
    `, [month + '-01']);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching spending report:', error);
    res.status(500).json({ error: 'Failed to fetch spending report' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});