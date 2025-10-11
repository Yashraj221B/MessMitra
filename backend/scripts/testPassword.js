const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_DATABASE
});

async function testPassword() {
  try {
    const result = await pool.query(
      'SELECT password FROM users WHERE phone = $1',
      ['9999999999']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const storedHash = result.rows[0].password;
    console.log('Stored hash:', storedHash);
    console.log('Hash length:', storedHash.length);
    console.log('Starts with $2b$10$:', storedHash.startsWith('$2b$10$'));
    
    const testPassword = 'admin123';
    console.log('\nTesting password:', testPassword);
    
    const isValid = await bcrypt.compare(testPassword, storedHash);
    console.log('✅ Password is valid:', isValid);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testPassword();
