-- Idempotent schema init for auth service (MySQL)
-- Will run only on first MySQL initialization of the data directory

-- Ensure database exists (must match .env MYSQL_DATABASE)
CREATE DATABASE IF NOT EXISTS `auth_db`;
USE `auth_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `hashed_password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer','staff') NOT NULL DEFAULT 'customer',
  `full_name` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
