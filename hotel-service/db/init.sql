-- Idempotent schema init for hotel service (MySQL)
-- Creates dedicated database, user, and table for hotel-service

-- Create database
CREATE DATABASE IF NOT EXISTS `hotel_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel_db`;

-- Create application user (if not exists) and grant privileges
-- Note: MySQL 8 supports IF NOT EXISTS for CREATE USER
CREATE USER IF NOT EXISTS 'hotel_user'@'%' IDENTIFIED BY 'hotel_password';
GRANT ALL PRIVILEGES ON `hotel_db`.* TO 'hotel_user'@'%';
FLUSH PRIVILEGES;

-- Create services table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_service_name` (`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
