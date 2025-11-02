-- Create Admin User Script
-- Run this in PostgreSQL after setting up the database

-- Step 1: Generate password hash for 'admin123'
-- bcrypt hash with 10 rounds for password 'admin123'
-- Run in Node.js first: require('bcrypt').hash('admin123', 10)

-- Step 2: Insert admin user with the generated hash
-- Replace <BCRYPT_HASH> with the actual hash from step 1

INSERT INTO users (
    id,
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
VALUES (
    uuid_generate_v4(),
    '9999999999',
    '$2b$10$dEWCAcMyuGj0D3ThlzkcVeXLtnlt4.wLwF2osYRk4WW0hVIQGSJBe',
    'Platform Administrator',
    'admin@messmitra.com',
    'admin',
    TRUE,
    'approved',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (phone) DO NOTHING;

-- Verify the admin user was created
SELECT id, phone, name, role, is_active FROM users WHERE role = 'admin';

-- ==========================================
-- Quick Setup Instructions:
-- ==========================================
-- 
-- 1. Generate password hash:
--    cd backend
--    node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log('Hash:', hash));"
--
-- 2. Copy the hash and replace '$2b$10$YourBcryptHashHere' above
--
-- 3. Run this SQL file:
--    psql -U postgres -d messmitra -f create_admin_user.sql
--
-- 4. Test login with:
--    Phone: 9999999999
--    Password: admin123
--
-- ==========================================

-- Alternative: Create multiple admin users
-- Uncomment and modify as needed:

-- INSERT INTO users (phone, password, name, email, role, is_active, join_status) 
-- VALUES ('1234567890', '$2b$10$AnotherHashHere', 'Secondary Admin', 'admin2@messmitra.com', 'admin', TRUE, 'approved');
