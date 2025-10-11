/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database with proper bcrypt password hashing.
 * 
 * Usage:
 *   node scripts/createAdmin.js
 * 
 * Or with custom credentials:
 *   node scripts/createAdmin.js --phone=1234567890 --password=mypassword --name="John Doe"
 */

const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');

// Load .env from backend directory (parent of scripts)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

// Admin user credentials
const ADMIN_PHONE = getArg('phone', '9999999999');
const ADMIN_PASSWORD = getArg('password', 'admin123');
const ADMIN_NAME = getArg('name', 'Platform Administrator');
const ADMIN_EMAIL = getArg('email', 'admin@messmitra.com');

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
  database: process.env.DB_DATABASE || 'messmitra',
});

// Validate required environment variables
if (!process.env.DB_PASSWORD) {
  console.error('❌ Error: DB_PASSWORD is not set in .env file');
  console.error('Please check your backend/.env file and ensure DB_PASSWORD is set.');
  process.exit(1);
}

async function createAdminUser() {
  console.log('🔐 Creating Admin User...\n');
  console.log('Phone:', ADMIN_PHONE);
  console.log('Name:', ADMIN_NAME);
  console.log('Email:', ADMIN_EMAIL);
  console.log('Password:', '*'.repeat(ADMIN_PASSWORD.length), '\n');

  try {
    // Check if admin already exists
    const checkQuery = 'SELECT id, phone, name, role FROM users WHERE phone = $1';
    const checkResult = await pool.query(checkQuery, [ADMIN_PHONE]);

    if (checkResult.rows.length > 0) {
      const existing = checkResult.rows[0];
      console.log('⚠️  User with this phone already exists:');
      console.log('   ID:', existing.id);
      console.log('   Name:', existing.name);
      console.log('   Role:', existing.role);
      console.log('\n❓ Do you want to update the password? (Manual step required)');
      await pool.end();
      return;
    }

    // Hash the password
    console.log('🔒 Hashing password...');
    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, bcryptRounds);
    console.log('✅ Password hashed successfully\n');

    // Insert admin user
    const insertQuery = `
      INSERT INTO users (
        phone, 
        password, 
        name, 
        email,
        role, 
        is_active, 
        join_status,
        created_at,
        updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, phone, name, email, role;
    `;

    console.log('💾 Inserting admin user into database...');
    const insertResult = await pool.query(insertQuery, [
      ADMIN_PHONE,
      hashedPassword,
      ADMIN_NAME,
      ADMIN_EMAIL,
      'admin',
      true,
      'approved'
    ]);

    const adminUser = insertResult.rows[0];
    console.log('✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Phone:   ', ADMIN_PHONE);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('Name:    ', adminUser.name);
    console.log('Email:   ', adminUser.email);
    console.log('Role:    ', adminUser.role);
    console.log('ID:      ', adminUser.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 You can now login to the admin panel!\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
createAdminUser();
