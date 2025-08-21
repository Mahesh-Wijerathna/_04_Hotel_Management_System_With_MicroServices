-- Idempotent schema for booking-service
CREATE DATABASE IF NOT EXISTS `booking_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `booking_db`;

CREATE USER IF NOT EXISTS 'booking_user'@'%' IDENTIFIED BY 'booking_password';
GRANT ALL PRIVILEGES ON `booking_db`.* TO 'booking_user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `scheduled_for` DATETIME NULL,
  `status` ENUM('pending','confirmed','canceled') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `ix_user_id` (`user_id`),
  INDEX `ix_service_id` (`service_id`),
  INDEX `ix_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
