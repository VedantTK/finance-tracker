-- users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);

-- transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    timestamp DATE NOT NULL
);

-- Insert a default user for testing
INSERT INTO users (id, name) VALUES (1, 'Demo User') ON CONFLICT DO NOTHING;
