CREATE DATABASE IF NOT EXISTS `payment_db`;
USE `payment_db`;

CREATE USER IF NOT EXISTS 'payment_user'@'%' IDENTIFIED BY 'payment_password';
GRANT ALL PRIVILEGES ON payment_db.* TO 'payment_user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `method` VARCHAR(32) NOT NULL DEFAULT 'card',
  `status` ENUM('pending','succeeded','failed','refunded') NOT NULL DEFAULT 'succeeded',
  `provider` VARCHAR(32) NULL,
  `provider_payment_id` VARCHAR(128) NULL,
  `idempotency_key` VARCHAR(64) NOT NULL,
  `error_code` VARCHAR(64) NULL,
  `error_message` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `ux_idempotency_key` (`idempotency_key`),
  KEY `ix_booking_id` (`booking_id`),
  KEY `ix_user_id` (`user_id`),
  KEY `ix_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
