-- ==========================================================
-- Diversion Vigan Transient Hotel Database Backup
-- Format: SQL (Compatible with MySQL, PostgreSQL, SQLite)
-- Exported: 2026-09-22
-- ==========================================================

-- 1. Table: rooms
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    beds_count INT DEFAULT 1,
    baths_count INT DEFAULT 1,
    rating DECIMAL(3,2) DEFAULT 5.00,
    price_per_night DECIMAL(10,2) NOT NULL,
    price_per_hour DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'Available',
    is_clean BOOLEAN DEFAULT TRUE,
    floor INT DEFAULT 1,
    size_sqm INT DEFAULT 30,
    description TEXT,
    custom_rates JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(50) PRIMARY KEY,
    confirmation_code VARCHAR(50) UNIQUE NOT NULL,
    room_id VARCHAR(50) REFERENCES rooms(id),
    room_name VARCHAR(150),
    room_number VARCHAR(20),
    guest_name VARCHAR(150) NOT NULL,
    guest_email VARCHAR(150) NOT NULL,
    guest_phone VARCHAR(50),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'confirmed',
    payment_method VARCHAR(50) DEFAULT 'Cash',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: guest_reviews
CREATE TABLE IF NOT EXISTS guest_reviews (
    id VARCHAR(50) PRIMARY KEY,
    room_id VARCHAR(50) REFERENCES rooms(id),
    room_name VARCHAR(150),
    room_number VARCHAR(20),
    guest_name VARCHAR(150) NOT NULL,
    guest_email VARCHAR(150) NOT NULL,
    booking_code VARCHAR(50),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    screening_status VARCHAR(30) DEFAULT 'pending',
    is_verified_stay BOOLEAN DEFAULT FALSE,
    screening_note TEXT,
    staff_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- SEED DATA INSERTS
-- ==========================================================

-- Insert Rooms
INSERT INTO rooms (id, room_number, name, category, capacity, price_per_night, price_per_hour, status, is_clean, floor, size_sqm) VALUES
('room-0', '0', 'Room 0 - Big Family Room', 'Family Suites', 8, 2000.00, 220.00, 'Available', TRUE, 1, 45),
('room-1', '1', 'Room 1 - Big Family Room', 'Family Suites', 8, 2000.00, 250.00, 'Available', TRUE, 1, 45),
('room-2', '2', 'Room 2 - Loft type Family', 'Lofts', 10, 2000.00, 280.00, 'Available', TRUE, 2, 60),
('room-3', '3', 'Room 3 - Loft type Family', 'Lofts', 10, 2000.00, 280.00, 'Available', TRUE, 2, 60),
('room-14', '14', 'Room 14 - Family Room', 'Family Suites', 5, 1000.00, 150.00, 'Available', TRUE, 1, 32),
('room-15', '15', 'Room 15 - Family Room', 'Family Suites', 5, 1000.00, 150.00, 'Available', TRUE, 1, 32),
('room-16', '16', 'Room 16 - Family Room', 'Family Suites', 5, 1000.00, 150.00, 'Available', TRUE, 1, 32),
('room-17', '17', 'Room 17 - Private Villa', 'Villa', 20, 7000.00, 800.00, 'Available', TRUE, 1, 140);

-- Insert Sample Reservations
INSERT INTO reservations (id, confirmation_code, room_id, room_name, room_number, guest_name, guest_email, guest_phone, check_in_date, check_out_date, number_of_guests, total_amount, status, payment_method) VALUES
('res-101', 'DIV-2026-8812', 'room-17', 'Room 17 - Private Villa', '17', 'Carlos Mendoza', 'carlos.mendoza@example.com', '+63 917 555 4321', '2026-09-24', '2026-09-26', 12, 15600.00, 'confirmed', 'GCash'),
('res-102', 'DIV-2026-7734', 'room-0', 'Room 0 - Big Family Room', '0', 'Maria Santos', 'maria.santos@example.com', '+63 920 888 1234', '2026-09-23', '2026-09-25', 6, 4800.00, 'checked-in', 'Cash on Arrival'),
('res-103', 'DIV-2026-6641', 'room-14', 'Room 14 - Family Room', '14', 'Jerome Valdez', 'jerome.valdez@example.com', '+63 918 222 9988', '2026-09-22', '2026-09-23', 4, 1350.00, 'confirmed', 'Maya');

-- Insert Reviews
INSERT INTO guest_reviews (id, room_id, room_name, room_number, guest_name, guest_email, booking_code, rating, title, comment, screening_status, is_verified_stay, staff_response) VALUES
('rev-1', 'room-17', 'Room 17 - Private Villa', '17', 'Eduardo Ramos', 'eduardo.ramos@example.com', 'DIV-2026-8812', 5, 'Unforgettable Family Reunion at the Villa!', 'The private pool and BBQ pavilion made our Vigan trip incredible. The place was spotless and only 5 mins away from Calle Crisologo.', 'approved', TRUE, 'Thank you Eduardo! It was a pleasure hosting your family.'),
('rev-2', 'room-0', 'Room 0 - Big Family Room', '0', 'Patricia De Leon', 'patricia.deleon@example.com', 'DIV-2026-7734', 5, 'Super comfortable beds & cold AC', 'Very spacious for our family of 7. Wi-Fi was fast and front desk staff was very accommodating with extra pillows.', 'approved', TRUE, NULL),
('rev-3', 'room-14', 'Room 14 - Family Room', '14', 'Christian Lim', 'christian.lim@example.com', NULL, 5, 'Great value for money near heritage area', 'Clean room, quiet location along Diversion road away from traffic noise, and very affordable nightly rate.', 'pending', FALSE, NULL);
