import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const { Pool } = pg;

// Create a PostgreSQL client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  console.log('Connecting to database...');
  
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database');

    // Create tables if they don't exist
    console.log('Creating tables if they don\'t exist...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        university TEXT NOT NULL,
        profile_image TEXT,
        bio TEXT,
        rating DOUBLE PRECISION DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        is_driver BOOLEAN DEFAULT FALSE,
        car_model TEXT,
        license_plate TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rides (
        id SERIAL PRIMARY KEY,
        driver_id INTEGER NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        departure_time TIMESTAMP NOT NULL,
        price INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        description TEXT,
        recurring BOOLEAN DEFAULT FALSE,
        recurring_days TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        ride_id INTEGER NOT NULL,
        passenger_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        reviewer_id INTEGER NOT NULL,
        reviewee_id INTEGER NOT NULL,
        ride_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        relationship TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS emergency_alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        ride_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        latitude TEXT,
        longitude TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        resolved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully');
    
    // Create a test user and ride if the database is empty
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('Creating test data...');
      
      // Create a test driver
      const driverResult = await client.query(`
        INSERT INTO users (username, password, full_name, email, university, is_driver, car_model, license_plate)
        VALUES ('testdriver', '$2b$10$3Gd3FJSfDGjnxfYnNnVJm.lLnwJ0T5dMhyI11ECQIEvf1oUxnTSbm', 'Test Driver', 'driver@example.com', 'Mapúa Malayan Colleges Laguna (MMCL)', TRUE, 'Toyota Vios', 'ABC-123')
        RETURNING id
      `);
      
      const driverId = driverResult.rows[0].id;
      
      // Create a test passenger
      await client.query(`
        INSERT INTO users (username, password, full_name, email, university)
        VALUES ('testpassenger', '$2b$10$3Gd3FJSfDGjnxfYnNnVJm.lLnwJ0T5dMhyI11ECQIEvf1oUxnTSbm', 'Test Passenger', 'passenger@example.com', 'Mapúa Malayan Colleges Laguna (MMCL)')
      `);
      
      // Create a test ride
      await client.query(`
        INSERT INTO rides (driver_id, origin, destination, departure_time, price, available_seats, description)
        VALUES ($1, 'Mapúa Malayan Colleges Laguna', 'SM Calamba', CURRENT_TIMESTAMP + INTERVAL '2 days', 100, 3, 'Daily ride to SM Calamba')
      `, [driverId]);
      
      console.log('Test data created successfully');
    }
    
    client.release();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main(); 