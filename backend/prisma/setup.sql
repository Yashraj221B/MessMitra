-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.
-- THIS IS AN OBSOLETE FILE. PLEASE DO NOT USE | ONLY USE FOR REFERENCE.

-- MessMitra Database Schema
-- PostgreSQL Database Setup Script

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS messmitra;
CREATE DATABASE messmitra;

-- Connect to messmitra database
\c messmitra;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ENUMS
-- ==========================================

-- User Role Enum
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'member');

-- Join Status Enum
CREATE TYPE join_status AS ENUM ('pending', 'approved', 'rejected');

-- Meal Type Enum
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner');

-- Attendance Status Enum
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'on-leave');

-- Scan Method Enum
CREATE TYPE scan_method AS ENUM ('qr', 'manual');

-- Leave Status Enum
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- Leave Category Enum
CREATE TYPE leave_category AS ENUM ('personal', 'medical', 'vacation', 'other');

-- Payment Status Enum
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partial', 'overdue');

-- Payment Method Enum
CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'card', 'bank_transfer', 'other');

-- Announcement Priority Enum
CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Target Audience Enum
CREATE TYPE target_audience AS ENUM ('all', 'managers', 'members');

-- Feedback Category Enum
CREATE TYPE feedback_category AS ENUM ('food_quality', 'service', 'cleanliness', 'staff', 'facilities', 'other');

-- Notification Type Enum
CREATE TYPE notification_type AS ENUM (
    'join_request', 'join_approved', 'join_rejected',
    'payment_due', 'payment_received', 'payment_overdue',
    'leave_request', 'leave_approved', 'leave_rejected',
    'announcement', 'menu_updated', 'general'
);

-- ==========================================
-- TABLES
-- ==========================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role user_role NOT NULL DEFAULT 'member',
    profile_picture TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    mess_id UUID,
    join_status join_status DEFAULT 'pending',
    
    -- Preferences (JSONB)
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(20) DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    
    -- Security
    token_version INTEGER DEFAULT 0,
    refresh_token TEXT,
    last_login TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messes Table
CREATE TABLE messes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    owner_id UUID NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    description TEXT,
    
    -- Capacity & Members
    capacity INTEGER NOT NULL,
    current_members INTEGER DEFAULT 0,
    
    -- Pricing
    monthly_fee DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) DEFAULT 0,
    
    -- Timings (JSONB)
    breakfast_time VARCHAR(20),
    lunch_time VARCHAR(20),
    dinner_time VARCHAR(20),
    
    -- Features (JSONB)
    has_attendance BOOLEAN DEFAULT TRUE,
    has_payments BOOLEAN DEFAULT TRUE,
    has_menu_planning BOOLEAN DEFAULT TRUE,
    has_feedback BOOLEAN DEFAULT TRUE,
    has_qr_scanning BOOLEAN DEFAULT TRUE,
    
    -- Settings (JSONB)
    auto_approve_requests BOOLEAN DEFAULT FALSE,
    require_security_deposit BOOLEAN DEFAULT FALSE,
    send_payment_reminders BOOLEAN DEFAULT TRUE,
    allow_feedback BOOLEAN DEFAULT TRUE,
    show_menu_in_advance INTEGER DEFAULT 7,
    
    -- QR Code
    qr_code TEXT UNIQUE,
    qr_code_expiry TIMESTAMP,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menus Table
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mess_id UUID NOT NULL,
    date DATE NOT NULL,
    
    -- Meals (JSONB - stores meal details)
    breakfast_items TEXT[],
    breakfast_time VARCHAR(20),
    breakfast_calories INTEGER,
    breakfast_is_special BOOLEAN DEFAULT FALSE,
    
    lunch_items TEXT[],
    lunch_time VARCHAR(20),
    lunch_calories INTEGER,
    lunch_is_special BOOLEAN DEFAULT FALSE,
    
    dinner_items TEXT[],
    dinner_time VARCHAR(20),
    dinner_calories INTEGER,
    dinner_is_special BOOLEAN DEFAULT FALSE,
    
    -- Additional
    notes TEXT,
    is_holiday BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(mess_id, date)
);

-- Attendance Table
CREATE TABLE attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mess_id UUID NOT NULL,
    member_id UUID NOT NULL,
    date DATE NOT NULL,
    meal_type meal_type NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    
    -- Scanning Details
    scanned_at TIMESTAMP,
    scanned_by UUID,
    scan_method scan_method,
    
    -- Location (JSONB)
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_accuracy DECIMAL(10, 2),
    
    -- Device Info (JSONB)
    device_user_agent TEXT,
    device_ip VARCHAR(45),
    
    -- Notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(mess_id, member_id, date, meal_type)
);

-- Leaves Table
CREATE TABLE leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mess_id UUID NOT NULL,
    member_id UUID NOT NULL,
    
    -- Period
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    
    -- Request
    reason TEXT NOT NULL,
    category leave_category DEFAULT 'personal',
    
    -- Status
    status leave_status DEFAULT 'pending',
    
    -- Review
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    
    -- Notifications
    notification_sent BOOLEAN DEFAULT FALSE,
    member_notified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mess_id UUID NOT NULL,
    member_id UUID NOT NULL,
    
    -- Period
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    late_fee DECIMAL(10, 2) DEFAULT 0,
    
    -- Dates
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Status
    status payment_status DEFAULT 'pending',
    
    -- Payment Details
    payment_method payment_method,
    transaction_id VARCHAR(100),
    receipt_number VARCHAR(50),
    notes TEXT,
    
    -- Reminders
    reminders_sent INTEGER DEFAULT 0,
    last_reminder_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(mess_id, member_id, month, year)
);

-- Announcements Table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mess_id UUID NOT NULL,
    
    -- Content
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Targeting
    priority announcement_priority DEFAULT 'medium',
    target_audience target_audience DEFAULT 'all',
    
    -- Creator
    created_by UUID NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Table
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mess_id UUID NOT NULL,
    member_id UUID,
    
    -- Feedback
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    category feedback_category DEFAULT 'other',
    
    -- Anonymous
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Response
    response TEXT,
    responded_by UUID,
    responded_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mess_id UUID,
    
    -- Content
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Additional Data (JSONB)
    metadata JSONB,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Users Indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_mess_id ON users(mess_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_join_status ON users(join_status);

-- Messes Indexes
CREATE INDEX idx_messes_owner_id ON messes(owner_id);
CREATE INDEX idx_messes_is_active ON messes(is_active);
CREATE INDEX idx_messes_qr_code ON messes(qr_code);

-- Menus Indexes
CREATE INDEX idx_menus_mess_id ON menus(mess_id);
CREATE INDEX idx_menus_date ON menus(date);
CREATE INDEX idx_menus_mess_date ON menus(mess_id, date);

-- Attendance Indexes
CREATE INDEX idx_attendance_mess_id ON attendances(mess_id);
CREATE INDEX idx_attendance_member_id ON attendances(member_id);
CREATE INDEX idx_attendance_date ON attendances(date);
CREATE INDEX idx_attendance_mess_date ON attendances(mess_id, date);
CREATE INDEX idx_attendance_member_date ON attendances(member_id, date);

-- Leaves Indexes
CREATE INDEX idx_leaves_mess_id ON leaves(mess_id);
CREATE INDEX idx_leaves_member_id ON leaves(member_id);
CREATE INDEX idx_leaves_status ON leaves(status);
CREATE INDEX idx_leaves_dates ON leaves(start_date, end_date);

-- Payments Indexes
CREATE INDEX idx_payments_mess_id ON payments(mess_id);
CREATE INDEX idx_payments_member_id ON payments(member_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_period ON payments(month, year);

-- Announcements Indexes
CREATE INDEX idx_announcements_mess_id ON announcements(mess_id);
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);

-- Feedback Indexes
CREATE INDEX idx_feedback_mess_id ON feedbacks(mess_id);
CREATE INDEX idx_feedback_member_id ON feedbacks(member_id);
CREATE INDEX idx_feedback_category ON feedbacks(category);
CREATE INDEX idx_feedback_rating ON feedbacks(rating);

-- Notifications Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_mess_id ON notifications(mess_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ==========================================
-- FOREIGN KEYS
-- ==========================================

-- Users foreign keys
ALTER TABLE users ADD CONSTRAINT fk_users_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE SET NULL;

-- Messes foreign keys
ALTER TABLE messes ADD CONSTRAINT fk_messes_owner 
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

-- Menus foreign keys
ALTER TABLE menus ADD CONSTRAINT fk_menus_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE CASCADE;

-- Attendance foreign keys
ALTER TABLE attendances ADD CONSTRAINT fk_attendance_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE CASCADE;
ALTER TABLE attendances ADD CONSTRAINT fk_attendance_member 
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE attendances ADD CONSTRAINT fk_attendance_scanner 
    FOREIGN KEY (scanned_by) REFERENCES users(id) ON DELETE SET NULL;

-- Leaves foreign keys
ALTER TABLE leaves ADD CONSTRAINT fk_leaves_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE CASCADE;
ALTER TABLE leaves ADD CONSTRAINT fk_leaves_member 
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE leaves ADD CONSTRAINT fk_leaves_reviewer 
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;

-- Payments foreign keys
ALTER TABLE payments ADD CONSTRAINT fk_payments_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE CASCADE;
ALTER TABLE payments ADD CONSTRAINT fk_payments_member 
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE;

-- Announcements foreign keys
ALTER TABLE announcements ADD CONSTRAINT fk_announcements_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE CASCADE;
ALTER TABLE announcements ADD CONSTRAINT fk_announcements_creator 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Feedback foreign keys
ALTER TABLE feedbacks ADD CONSTRAINT fk_feedback_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE CASCADE;
ALTER TABLE feedbacks ADD CONSTRAINT fk_feedback_member 
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE feedbacks ADD CONSTRAINT fk_feedback_responder 
    FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL;

-- Notifications foreign keys
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_mess 
    FOREIGN KEY (mess_id) REFERENCES messes(id) ON DELETE CASCADE;

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messes_updated_at BEFORE UPDATE ON messes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON attendances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaves_updated_at BEFORE UPDATE ON leaves
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedbacks_updated_at BEFORE UPDATE ON feedbacks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SAMPLE DATA (Optional)
-- ==========================================

-- Insert admin user
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

-- Success message
SELECT 'Database setup completed successfully!' AS message;
