-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2025 at 01:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthDate` datetime NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `firstName`, `lastName`, `email`, `birthDate`, `gender`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'John', 'Smith', 'john.smith@inventory.com', '1985-05-15 00:00:00', 'Male', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2023-01-10 09:15:22', '2023-01-10 09:15:22'),
(2, 'Sarah', 'Johnson', 'sarah.j@inventory.com', '1990-08-22 00:00:00', 'Female', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2023-01-12 14:30:45', '2023-01-12 14:30:45'),
(3, 'Michael', 'Brown', 'michael.b@inventory.com', '1988-03-30 00:00:00', 'Male', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2023-02-05 11:20:33', '2023-02-05 11:20:33');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Electronics', 'Electronic devices and components', '2023-01-15 10:00:00', '2023-01-15 10:00:00'),
(2, 'Office Supplies', 'Items for office use', '2023-01-15 10:05:00', '2023-01-15 10:05:00'),
(3, 'Furniture', 'Office furniture and equipment', '2023-01-16 09:30:00', '2023-01-16 09:30:00'),
(4, 'Stationery', 'Writing and paper products', '2023-01-17 14:15:00', '2023-01-17 14:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(500) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `image`, `categoryId`, `stock`, `createdAt`, `updatedAt`) VALUES
(1, 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 'mouse.jpg', 1, 50, '2023-01-20 11:00:00', '2023-03-10 16:20:00'),
(2, 'Keyboard', 'Mechanical gaming keyboard', 'keyboard.jpg', 1, 35, '2023-01-20 11:05:00', '2023-03-05 14:30:00'),
(3, 'Notebook', 'A4 size 100-page notebook', 'notebook.jpg', 4, 200, '2023-01-21 09:15:00', '2023-03-15 10:45:00'),
(4, 'Desk Chair', 'Ergonomic office chair with adjustable height', 'chair.jpg', 3, 15, '2023-01-22 14:00:00', '2023-02-28 11:20:00'),
(5, 'Stapler', 'Heavy-duty office stapler', 'stapler.jpg', 2, 80, '2023-01-23 10:30:00', '2023-03-01 09:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `transactionNumber` varchar(50) DEFAULT NULL,
  `type` enum('STOCK_IN','STOCK_OUT') NOT NULL,
  `description` text DEFAULT NULL,
  `adminId` int(11) NOT NULL,
  `status` enum('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `processedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `transactionNumber`, `type`, `description`, `adminId`, `status`, `processedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'TRX-20230301-001', '', 'Monthly restock order', 1, 'COMPLETED', '2023-03-01 10:00:00', '2023-03-01 09:45:00', '2023-03-01 10:30:00'),
(2, 'TRX-20230305-001', '', 'Office supply request', 2, 'COMPLETED', '2023-03-05 14:15:00', '2023-03-05 13:30:00', '2023-03-05 14:45:00'),
(3, 'TRX-20230310-001', '', 'New product arrival', 1, 'COMPLETED', '2023-03-10 16:00:00', '2023-03-10 15:30:00', '2023-03-10 16:45:00'),
(4, 'TRX-20230315-001', '', 'Department request', 3, 'PENDING', NULL, '2023-03-15 09:00:00', '2023-03-15 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

CREATE TABLE `transaction_items` (
  `id` int(11) NOT NULL,
  `transactionId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `stockBefore` int(11) NOT NULL,
  `stockAfter` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transactionId`, `productId`, `quantity`, `stockBefore`, `stockAfter`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 20, 30, 50, '2023-03-01 10:05:00', '2023-03-01 10:05:00'),
(2, 1, 2, 15, 20, 35, '2023-03-01 10:10:00', '2023-03-01 10:10:00'),
(3, 1, 5, 30, 50, 80, '2023-03-01 10:15:00', '2023-03-01 10:15:00'),
(4, 2, 3, 25, 225, 200, '2023-03-05 14:20:00', '2023-03-05 14:20:00'),
(5, 2, 5, 10, 80, 70, '2023-03-05 14:25:00', '2023-03-05 14:25:00'),
(6, 3, 1, 10, 50, 60, '2023-03-10 16:10:00', '2023-03-10 16:10:00'),
(7, 3, 4, 5, 10, 15, '2023-03-10 16:15:00', '2023-03-10 16:15:00'),
(8, 4, 2, 8, 35, 27, '2023-03-15 09:05:00', '2023-03-15 09:05:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactionNumber` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_2` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_3` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_4` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_5` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_6` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_7` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_8` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_9` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_10` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_11` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_12` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_13` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_14` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_15` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_16` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_17` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_18` (`transactionNumber`),
  ADD UNIQUE KEY `transactionNumber_19` (`transactionNumber`),
  ADD KEY `adminId` (`adminId`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactionId` (`transactionId`),
  ADD KEY `productId` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_ibfk_37` FOREIGN KEY (`transactionId`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaction_items_ibfk_38` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
