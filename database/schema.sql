-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2026 at 08:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hexa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `first_name`, `last_name`, `address_line_1`, `address_line_2`, `city`, `postal_code`, `country`, `phone`) VALUES
(1, 1, 'John', 'Wick', '45 Main Street', 'Apartment 5B', 'Colombo', '00100', 'Sri Lanka', '0770000001');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'T-Shirts'),
(2, 'Hoodies');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 'Alice', 'alice@example.com', 'Order', 'When will my order arrive?', '2026-03-27 10:50:43');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `shipping_method_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `address_id`, `shipping_method_id`, `total`, `status`, `created_at`) VALUES
(1, 1, 1, 1, 39.98, 'pending', '2026-03-27 10:50:42');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, NULL, 1, 19.99),
(2, 1, NULL, 1, 19.99);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `card_name` varchar(100) DEFAULT NULL,
  `card_number` varchar(30) DEFAULT NULL,
  `expiry` varchar(10) DEFAULT NULL,
  `cvv` varchar(10) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `card_name`, `card_number`, `expiry`, `cvv`, `amount`, `status`) VALUES
(1, 1, 'John Wick', '4111111111111111', '12/28', '123', 39.98, 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `stock` int(11) DEFAULT 50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `image`, `stock`) VALUES
(1, NULL, 'Veritas Strength Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-1.jpg', 50),
(2, NULL, 'Chorale Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-2.jpg', 50),
(3, NULL, 'Elan Focus Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-3.jpg', 50),
(4, NULL, 'Monogram Grid Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-4.jpg', 50),
(5, NULL, 'Racecraft Signature Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t5.jpg', 50),
(6, NULL, 'Architecte Blueprint Hoodie', 'Premium hoodie with detailed blueprint design.', 19.99, '/assets/t-6.jpg', 50),
(7, NULL, 'Minimalis Air Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-7.jpg', 50),
(8, NULL, 'Broadcast Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-8.jpg', 50),
(9, NULL, 'Justitia Statement Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-9.jpg', 50),
(10, NULL, 'Divinus Path Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-10.jpg', 50),
(11, NULL, 'Urban Luxe Code Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-7.jpg', 50),
(12, NULL, 'Divine Script Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-12.jpg', 50),
(13, NULL, 'Hexa Classic Tee', 'Soft cotton classic fit tee.', 19.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(14, NULL, 'Veritas Strength Tee', 'Strength themed cotton tee.', 22.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(15, NULL, 'Charole Noir Tee', 'Dark black style tee.', 18.99, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(16, NULL, 'Elion Focus Tee', 'Focus design everyday tee.', 24.99, 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400', 50),
(17, NULL, 'Divinus Path Tee', 'Path graphic cotton tee.', 20.99, 'https://images.unsplash.com/photo-1581686991899-836283602ebd?w=400', 50),
(18, NULL, 'Urban Street Tee', 'Streetwear urban fit.', 17.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(19, NULL, 'Vintage Graphic Tee', 'Retro graphic print tee.', 25.99, 'https://images.unsplash.com/photo-1542272604-787c38355321?w=400', 50),
(20, NULL, 'Minimalist White Tee', 'Clean minimalist design.', 16.99, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(21, NULL, 'Premium Cotton Tee', 'High quality cotton.', 28.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(22, NULL, 'Fitness Gym Tee', 'Gym ready performance tee.', 21.99, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(23, NULL, 'Graphic Bold Tee', 'Bold graphics tee.', 19.49, 'https://images.unsplash.com/photo-1618354691551-0a4049c8e8f8?w=400', 50),
(24, NULL, 'Casual Daily Tee', 'Casual everyday wear.', 15.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(25, NULL, 'Street Art Tee', 'Art inspired street tee.', 23.99, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(26, NULL, 'Eco Friendly Tee', 'Sustainable cotton tee.', 26.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(27, NULL, 'Summer Light Tee', 'Lightweight summer tee.', 18.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(28, NULL, 'Winter Heavy Tee', 'Heavy fabric winter tee.', 29.99, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(29, NULL, 'Logo Brand Tee', 'Brand logo tee.', 20.49, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(30, NULL, 'Funny Print Tee', 'Humorous print tee.', 17.49, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(31, NULL, 'Sport Performance Tee', 'Performance sport tee.', 24.49, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(32, NULL, 'Elegant Slim Fit Tee', 'Slim fit elegant.', 22.49, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(33, NULL, 'Oversize Loose Tee', 'Oversize casual.', 16.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(34, NULL, 'V Neck Tee', 'V-neck style tee.', 21.49, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(35, NULL, 'Polo Shirt Tee', 'Polo collar tee.', 27.99, 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400', 50),
(36, NULL, 'Long Sleeve Tee', 'Long sleeve cotton.', 25.49, 'https://images.unsplash.com/photo-1581686991899-836283602ebd?w=400', 50),
(37, NULL, 'Short Sleeve Tee', 'Short sleeve basic.', 14.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(38, NULL, 'Printed Pattern Tee', 'Pattern print tee.', 19.49, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(39, NULL, 'Solid Color Tee', 'Solid black tee.', 18.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(40, NULL, 'Striped Tee', 'Striped pattern tee.', 23.49, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(41, NULL, 'Camouflage Tee', 'Camouflage print tee.', 26.49, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(42, NULL, 'Floral Tee', 'Floral design tee.', 20.99, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(43, NULL, 'Geometric Tee', 'Geometric pattern tee.', 22.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(44, NULL, 'Abstract Art Tee', 'Abstract art print.', 24.99, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(45, NULL, 'Music Band Tee', 'Band logo tee.', 17.99, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(46, NULL, 'Movie Quote Tee', 'Movie quote print.', 21.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(47, NULL, 'Gaming Tee', 'Gamer theme tee.', 25.99, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(48, NULL, 'Tech Logo Tee', 'Tech brand tee.', 19.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(49, NULL, 'Nature Scene Tee', 'Nature inspired.', 28.99, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(50, NULL, 'Animal Print Tee', 'Animal motif tee.', 16.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(51, NULL, 'Food Theme Tee', 'Food graphic tee.', 20.49, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(52, NULL, 'Travel Adventure Tee', 'Adventure travel.', 23.99, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(53, NULL, 'Motivational Quote Tee', 'Motivational text.', 18.49, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(54, NULL, 'Luxury Brand Tee', 'Luxury style tee.', 32.99, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(55, NULL, 'Budget Basic Tee', 'Basic affordable tee.', 12.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(56, NULL, 'Organic Cotton Tee', 'Organic fabric tee.', 27.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(57, NULL, 'Quick Dry Tee', 'Quick dry sport tee.', 24.49, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(58, NULL, 'Thermal Tee', 'Thermal lined tee.', 29.49, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(59, NULL, 'Mesh Breathable Tee', 'Breathable mesh tee.', 22.49, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(60, NULL, 'Hoodie Tee', 'Hooded t-shirt.', 30.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(61, NULL, 'Pocket Tee', 'Pocket detail tee.', 19.49, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(62, NULL, 'Round Neck Tee', 'Round neck classic.', 15.49, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(63, NULL, 'Crew Neck Tee', 'Crew neck fit.', 21.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `avatar_url` varchar(512) DEFAULT NULL,
  `dark_mode` tinyint(1) NOT NULL DEFAULT 0,
  `font_size` int(11) NOT NULL DEFAULT 50,
  `language` varchar(32) NOT NULL DEFAULT 'English (US)',
  `email_notif` tinyint(1) NOT NULL DEFAULT 1,
  `sms_alerts` tinyint(1) NOT NULL DEFAULT 0,
  `newsletter` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_methods`
--

CREATE TABLE `shipping_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_methods`
--

INSERT INTO `shipping_methods` (`id`, `name`, `price`) VALUES
(1, 'Standard', 0.00),
(2, 'Express', 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `phone`, `created_at`) VALUES
(1, 'John Wick', 'john@example.com', '123456', 'customer', '0770000001', '2026-03-27 10:50:42'),
(2, 'Shavindi Ridmamali Aloka', 'shavindialoka69@gmail.com', '$2b$10$wJjkRrevkcPL/VJhutNTeu5WGiFFMEX5OEK89oBo0b2ix.roEUrce', 'admin', NULL, '2026-03-30 10:29:24'),
(3, 'Thamidu', 'thamidu1234@gmail.com', '$2b$10$twH.UiTp8FD/E6E6ppUWEuNEQSvBXFj7nFl8ENbitAGT5WCDfFEVu', 'customer', NULL, '2026-04-03 05:58:02'),
(4, 'Shehan', 'shehan1234@gmail.com', '$2b$10$BH6PNk1mwmmMjrbALRSJnOkfpzv5tJtkvbBRANqFkDwIi4YTDZCcG', 'customer', NULL, '2026-04-03 06:03:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `shipping_method_id` (`shipping_method_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 22, 2026 at 07:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!40101 SET NAMES utf8mb4 */;


-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'T-Shirts'),
(2, 'Hoodies');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 'Alice', 'alice@example.com', 'Order', 'When will my order arrive?', '2026-03-27 10:50:43');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `shipping_method_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `address_id`, `shipping_method_id`, `total`, `status`, `created_at`) VALUES
(1, 1, 1, 1, 39.98, 'pending', '2026-03-27 10:50:42');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, NULL, 1, 19.99),
(2, 1, NULL, 1, 19.99);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `card_name` varchar(100) DEFAULT NULL,
  `card_number` varchar(30) DEFAULT NULL,
  `expiry` varchar(10) DEFAULT NULL,
  `cvv` varchar(10) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `card_name`, `card_number`, `expiry`, `cvv`, `amount`, `status`) VALUES
(1, 1, 'John Wick', '4111111111111111', '12/28', '123', 39.98, 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `stock` int(11) DEFAULT 50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `image`, `stock`) VALUES
(1, NULL, 'Veritas Strength Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-asif-hussain-139434523-13983318.jpg', 50),
(2, NULL, 'Chorale Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-36899307.jpg', 50),
(3, NULL, 'Elan Focus Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-36908562.jpg', 50),
(4, NULL, 'Monogram Grid Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-36908564.jpg', 50),
(5, NULL, 'Racecraft Signature Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-36908588.jpg', 50),
(6, NULL, 'Architecte Blueprint Hoodie', 'Premium hoodie with detailed blueprint design.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-37025819.jpg', 50),
(7, NULL, 'Minimalis Air Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-37026122.jpg', 50),
(8, NULL, 'Broadcast Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-37066757.jpg', 50),
(9, NULL, 'Justitia Statement Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-37026122.jpg', 50),
(10, NULL, 'Divinus Path Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-bandar-baant-2160637741-37092621.jpg', 50),
(11, NULL, 'Urban Luxe Code Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-ben-khatry-430197437-15943977.jpg', 50),
(12, NULL, 'Divine Script Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/images/Design/pexels-edmilson-eucleni-64454054-11782729.jpg', 50),
(13, NULL, 'Hexa Classic Tee', 'Soft cotton classic fit tee.', 19.99, '/images/Design/pexels-eliasdecarvalho-1007021.jpg', 50),
(14, NULL, 'Veritas Strength Tee', 'Strength themed cotton tee.', 22.99, '/images/Design/pexels-mart-production-9558766.jpg', 50),
(15, NULL, 'Charole Noir Tee', 'Dark black style tee.', 18.99, '/images/Design/pexels-oficialwallace-16526622.jpg', 50),
(16, NULL, 'Elion Focus Tee', 'Focus design everyday tee.', 24.99, '/images/Design/pexels-palace-17400414.jpg', 50),
(17, NULL, 'Divinus Path Tee', 'Path graphic cotton tee.', 20.99, '/images/Design/pexels-rehman-alee-2153074881-32597798.jpg', 50),
(18, NULL, 'Urban Street Tee', 'Streetwear urban fit.', 17.99, '/images/Design/pexels-bandar-baant-2160637741-36899307.jpg', 50),
(19, NULL, 'Vintage Graphic Tee', 'Retro graphic print tee.', 25.99, '/images/Design/pexels-bandar-baant-2160637741-36908564.jpg', 50),
(20, NULL, 'Minimalist White Tee', 'Clean minimalist design.', 16.99, '/images/Design/pexels-bandar-baant-2160637741-37092621.jpg', 50),
(21, NULL, 'Premium Cotton Tee', 'High quality cotton.', 28.99, '/images/Design/pexels-eliasdecarvalho-1007021.jpg', 50),
(22, NULL, 'Fitness Gym Tee', 'Gym ready performance tee.', 21.99, '/images/Design/pexels-bandar-baant-2160637741-36908562.jpg', 50),
(23, NULL, 'Graphic Bold Tee', 'Bold graphics tee.', 19.49, '/images/Design/pexels-palace-17400414.jpg', 50),
(24, NULL, 'Casual Daily Tee', 'Casual everyday wear.', 15.99, '/images/Design/pexels-rehman-alee-2153074881-32597798.jpg', 50),
(25, NULL, 'Street Art Tee', 'Art inspired street tee.', 23.99, '/images/Design/pexels-bandar-baant-2160637741-36908588.jpg', 50),
(26, NULL, 'Eco Friendly Tee', 'Sustainable cotton tee.', 26.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(27, NULL, 'Summer Light Tee', 'Lightweight summer tee.', 18.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(28, NULL, 'Winter Heavy Tee', 'Heavy fabric winter tee.', 29.99, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(29, NULL, 'Logo Brand Tee', 'Brand logo tee.', 20.49, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(30, NULL, 'Funny Print Tee', 'Humorous print tee.', 17.49, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(31, NULL, 'Sport Performance Tee', 'Performance sport tee.', 24.49, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(32, NULL, 'Elegant Slim Fit Tee', 'Slim fit elegant.', 22.49, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(33, NULL, 'Oversize Loose Tee', 'Oversize casual.', 16.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(34, NULL, 'V Neck Tee', 'V-neck style tee.', 21.49, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(35, NULL, 'Polo Shirt Tee', 'Polo collar tee.', 27.99, 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400', 50),
(36, NULL, 'Long Sleeve Tee', 'Long sleeve cotton.', 25.49, 'https://images.unsplash.com/photo-1581686991899-836283602ebd?w=400', 50),
(37, NULL, 'Short Sleeve Tee', 'Short sleeve basic.', 14.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(38, NULL, 'Printed Pattern Tee', 'Pattern print tee.', 19.49, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(39, NULL, 'Solid Color Tee', 'Solid black tee.', 18.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(40, NULL, 'Striped Tee', 'Striped pattern tee.', 23.49, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(41, NULL, 'Camouflage Tee', 'Camouflage print tee.', 26.49, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(42, NULL, 'Floral Tee', 'Floral design tee.', 20.99, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(43, NULL, 'Geometric Tee', 'Geometric pattern tee.', 22.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(44, NULL, 'Abstract Art Tee', 'Abstract art print.', 24.99, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(45, NULL, 'Music Band Tee', 'Band logo tee.', 17.99, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(46, NULL, 'Movie Quote Tee', 'Movie quote print.', 21.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(47, NULL, 'Gaming Tee', 'Gamer theme tee.', 25.99, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(48, NULL, 'Tech Logo Tee', 'Tech brand tee.', 19.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(49, NULL, 'Nature Scene Tee', 'Nature inspired.', 28.99, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(50, NULL, 'Animal Print Tee', 'Animal motif tee.', 16.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(51, NULL, 'Food Theme Tee', 'Food graphic tee.', 20.49, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(52, NULL, 'Travel Adventure Tee', 'Adventure travel.', 23.99, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(53, NULL, 'Motivational Quote Tee', 'Motivational text.', 18.49, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(54, NULL, 'Luxury Brand Tee', 'Luxury style tee.', 32.99, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(55, NULL, 'Budget Basic Tee', 'Basic affordable tee.', 12.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(56, NULL, 'Organic Cotton Tee', 'Organic fabric tee.', 27.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50),
(57, NULL, 'Quick Dry Tee', 'Quick dry sport tee.', 24.49, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', 50),
(58, NULL, 'Thermal Tee', 'Thermal lined tee.', 29.49, 'https://images.unsplash.com/photo-1574179208501-42ad3995ca89?w=400', 50),
(59, NULL, 'Mesh Breathable Tee', 'Breathable mesh tee.', 22.49, 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17b?w=400', 50),
(60, NULL, 'Hoodie Tee', 'Hooded t-shirt.', 30.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 50),
(61, NULL, 'Pocket Tee', 'Pocket detail tee.', 19.49, 'https://images.unsplash.com/photo-1580489944761-10a60ba3a124?w=400', 50),
(62, NULL, 'Round Neck Tee', 'Round neck classic.', 15.49, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 50),
(63, NULL, 'Crew Neck Tee', 'Crew neck fit.', 21.49, 'https://images.unsplash.com/photo-1520975954730-3e44d20e5c5e?w=400', 50);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `avatar_url` varchar(512) DEFAULT NULL,
  `dark_mode` tinyint(1) NOT NULL DEFAULT 0,
  `font_size` int(11) NOT NULL DEFAULT 50,
  `language` varchar(32) NOT NULL DEFAULT 'English (US)',
  `email_notif` tinyint(1) NOT NULL DEFAULT 1,
  `sms_alerts` tinyint(1) NOT NULL DEFAULT 0,
  `newsletter` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_methods`
--

CREATE TABLE `shipping_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_methods`
--

INSERT INTO `shipping_methods` (`id`, `name`, `price`) VALUES
(1, 'Standard', 0.00),
(2, 'Express', 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `phone`, `created_at`) VALUES
(1, 'John Wick', 'john@example.com', '123456', 'customer', '0770000001', '2026-03-27 10:50:42'),
(2, 'Shavindi Ridmamali Aloka', 'shavindialoka69@gmail.com', '$2b$10$wJjkRrevkcPL/VJhutNTeu5WGiFFMEX5OEK89oBo0b2ix.roEUrce', 'admin', NULL, '2026-03-30 10:29:24'),
(3, 'Thamidu', 'thamidu1234@gmail.com', '$2b$10$twH.UiTp8FD/E6E6ppUWEuNEQSvBXFj7nFl8ENbitAGT5WCDfFEVu', 'customer', NULL, '2026-04-03 05:58:02'),
(4, 'Shehan', 'shehan1234@gmail.com', '$2b$10$BH6PNk1mwmmMjrbALRSJnOkfpzv5tJtkvbBRANqFkDwIi4YTDZCcG', 'customer', NULL, '2026-04-03 06:03:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `shipping_method_id` (`shipping_method_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Run once: mysql -u root -p < schema.sql
CREATE DATABASE IF NOT EXISTS hexal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hexal_db;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  avatar_url VARCHAR(512),
  dark_mode TINYINT(1) NOT NULL DEFAULT 0,
  font_size INT NOT NULL DEFAULT 50,
  language VARCHAR(32) NOT NULL DEFAULT 'English (US)',
  email_notif TINYINT(1) NOT NULL DEFAULT 1,
  sms_alerts TINYINT(1) NOT NULL DEFAULT 0,
  newsletter TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  variant VARCHAR(50) DEFAULT 'Classic Tee',
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(64),
  card_last_four VARCHAR(8),
  card_type VARCHAR(32),
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR(255),
  order_id INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    address_id INT,        -- NULL allowed
    shipping_method_id INT, -- NULL allowed
    total DECIMAL(10,2),
    status VARCHAR(20),    -- 'pending', 'processing', 'shipped', 'completed'
    created_at DATETIME,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    shipping_country VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create shipments table if not exists
CREATE TABLE IF NOT EXISTS shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    tracking_number VARCHAR(100),
    status ENUM('Ongoing', 'Completed', 'Delayed', 'in_transit', 'delivered') DEFAULT 'Ongoing',
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    shipping_country VARCHAR(100),
    shipped_date DATE,
    delivered_date DATE,
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Add shipping columns to orders table if not exists
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100);

-- Create index for better performance
CREATE INDEX idx_shipments_status ON shipments(status);

CREATE INDEX idx_shipments_created ON shipments(created_at);

CREATE INDEX idx_orders_created ON orders(created_at);

CREATE INDEX idx_orders_status ON orders(status);

-- Insert sample shipment data
INSERT INTO shipments (order_id, tracking_number, status, shipping_cost, shipping_country, shipped_date, delivered_date, created_at) VALUES
(1, 'TRK001', 'Completed', 15.50, 'USA', '2024-01-15', '2024-01-18', '2024-01-15 10:00:00'),
(2, 'TRK002', 'Ongoing', 12.00, 'Canada', '2024-01-16', NULL, '2024-01-16 11:00:00'),
(3, 'TRK003', 'Delayed', 18.00, 'Italy', '2024-01-14', NULL, '2024-01-14 09:00:00'),
(4, 'TRK004', 'Completed', 10.00, 'USA', '2024-01-17', '2024-01-19', '2024-01-17 14:00:00'),
(5, 'TRK005', 'Ongoing', 14.50, 'Canada', '2024-01-18', NULL, '2024-01-18 08:00:00');

-- Update orders with shipping info
UPDATE orders o 
SET o.shipping_cost = (
    SELECT s.shipping_cost 
    FROM shipments s 
    WHERE s.order_id = o.id 
    LIMIT 1
),
o.shipping_country = (
    SELECT s.shipping_country 
    FROM shipments s 
    WHERE s.order_id = o.id 
    LIMIT 1
)
WHERE EXISTS (SELECT 1 FROM shipments s WHERE s.order_id = o.id);

CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    priority VARCHAR(10),  -- 'High', 'Low'
    progress INT,          -- 0-100
    date DATE,
    user_id INT,
    status VARCHAR(20),    -- 'new', 'in_progress', 'completed'
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_name VARCHAR(100),
    action VARCHAR(50),    -- 'updated task', 'commented on project', 'created new task'
    file_name VARCHAR(100),
    text_content TEXT,
    created_at DATETIME
);

-- Run once: mysql -u root -p < schema.sql
CREATE DATABASE IF NOT EXISTS hexal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hexal_db;

-- Create shipments table if not exists
CREATE TABLE IF NOT EXISTS shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    tracking_number VARCHAR(100),
    status ENUM('Ongoing', 'Completed', 'Delayed', 'in_transit', 'delivered') DEFAULT 'Ongoing',
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    shipping_country VARCHAR(100),
    shipped_date DATE,
    delivered_date DATE,
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Add shipping columns to orders table if not exists
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_country VARCHAR(100);

-- Create index for better performance
CREATE INDEX idx_shipments_status ON shipments(status);

CREATE INDEX idx_shipments_created ON shipments(created_at);

CREATE INDEX idx_orders_created ON orders(created_at);

CREATE INDEX idx_orders_status ON orders(status);

-- Insert sample shipment data
INSERT INTO shipments (order_id, tracking_number, status, shipping_cost, shipping_country, shipped_date, delivered_date, created_at) VALUES
(1, 'TRK001', 'Completed', 15.50, 'USA', '2024-01-15', '2024-01-18', '2024-01-15 10:00:00'),
(2, 'TRK002', 'Ongoing', 12.00, 'Canada', '2024-01-16', NULL, '2024-01-16 11:00:00'),
(3, 'TRK003', 'Delayed', 18.00, 'Italy', '2024-01-14', NULL, '2024-01-14 09:00:00'),
(4, 'TRK004', 'Completed', 10.00, 'USA', '2024-01-17', '2024-01-19', '2024-01-17 14:00:00'),
(5, 'TRK005', 'Ongoing', 14.50, 'Canada', '2024-01-18', NULL, '2024-01-18 08:00:00');

-- Update orders with shipping info
UPDATE orders o 
SET o.shipping_cost = (
    SELECT s.shipping_cost 
    FROM shipments s 
    WHERE s.order_id = o.id 
    LIMIT 1
),
o.shipping_country = (
    SELECT s.shipping_country 
    FROM shipments s 
    WHERE s.order_id = o.id 
    LIMIT 1
)
WHERE EXISTS (SELECT 1 FROM shipments s WHERE s.order_id = o.id);

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2026 at 06:47 AM
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
-- Database: `hexa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `first_name`, `last_name`, `address_line_1`, `address_line_2`, `city`, `postal_code`, `country`, `phone`) VALUES
(1, 1, 'John', 'Wick', '45 Main Street', 'Apartment 5B', 'Colombo', '00100', 'Sri Lanka', '0770000001');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'T-Shirts'),
(2, 'Hoodies');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 'Alice', 'alice@example.com', 'Order', 'When will my order arrive?', '2026-03-27 10:50:43'),
(2, 'shavindi aloka', 'shavindialoka69@gmail.com', NULL, 'nooooooooooooooooooooooooo', '2026-04-20 06:15:57');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `shipping_method_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `address_id`, `shipping_method_id`, `total`, `status`, `created_at`) VALUES
(1, 1, 1, 1, 39.98, 'pending', '2026-03-27 10:50:42'),
(2, 2, NULL, NULL, 72.84, 'pending', '2026-04-20 05:43:00'),
(3, 2, NULL, NULL, 92.83, 'pending', '2026-04-20 05:43:23'),
(4, 2, NULL, NULL, 192.78, 'pending', '2026-04-20 06:33:52'),
(5, 2, NULL, NULL, 532.61, 'pending', '2026-04-20 06:37:53'),
(6, 2, NULL, NULL, 532.61, 'pending', '2026-04-21 09:16:00'),
(7, 2, NULL, NULL, 552.60, 'pending', '2026-04-21 10:24:01');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, NULL, 1, 19.99),
(2, 1, NULL, 1, 19.99),
(3, 2, 1, 3, 19.99),
(4, 3, 1, 3, 19.99),
(5, 3, 4, 1, 19.99),
(6, 4, 1, 3, 19.99),
(7, 4, 4, 1, 19.99),
(8, 4, 12, 3, 19.99),
(9, 4, 9, 2, 19.99),
(10, 5, 1, 3, 19.99),
(11, 5, 4, 1, 19.99),
(12, 5, 12, 10, 19.99),
(13, 5, 9, 3, 19.99),
(14, 5, 3, 4, 19.99),
(15, 5, 8, 5, 19.99),
(16, 6, 1, 3, 19.99),
(17, 6, 4, 1, 19.99),
(18, 6, 12, 10, 19.99),
(19, 6, 9, 3, 19.99),
(20, 6, 3, 4, 19.99),
(21, 6, 8, 5, 19.99),
(22, 7, 1, 4, 19.99),
(23, 7, 4, 1, 19.99),
(24, 7, 12, 10, 19.99),
(25, 7, 9, 3, 19.99),
(26, 7, 3, 4, 19.99),
(27, 7, 8, 5, 19.99);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `card_last_four` varchar(4) DEFAULT NULL,
  `card_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `payment_method`, `card_last_four`, `card_type`, `status`, `transaction_id`, `created_at`) VALUES
(1, 2, 72.84, 'credit_card', '4242', 'visa', 'completed', 'pi_1776663780725', '2026-04-20 11:13:00'),
(2, 3, 92.83, 'credit_card', '4242', 'visa', 'completed', 'pi_1776663803467', '2026-04-20 11:13:23'),
(3, 4, 192.78, 'credit_card', '4242', 'visa', 'completed', 'pi_1776666832231', '2026-04-20 12:03:52'),
(4, 5, 532.61, 'credit_card', '4242', 'visa', 'completed', 'pi_1776667073242', '2026-04-20 12:07:53'),
(5, 6, 532.61, 'credit_card', '4242', 'visa', 'completed', 'pi_1776762960584', '2026-04-21 14:46:00'),
(6, 7, 552.60, 'credit_card', '4242', 'visa', 'completed', 'pi_1776767041621', '2026-04-21 15:54:01');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `stock` int(11) DEFAULT 50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `image`, `stock`) VALUES
(1, 1, 'Veritas Strength Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-1.jpg', 50),
(2, 1, 'Chorale Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-2.jpg', 50),
(3, 1, 'Elan Focus Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-3.jpg', 50),
(4, 1, 'Monogram Grid Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-4.jpg', 50),
(5, 1, 'Racecraft Signature Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t5.jpg', 50),
(6, 2, 'Architecte Blueprint Hoodie', 'Premium hoodie with detailed blueprint design.', 19.99, '/assets/t-6.jpg', 50),
(7, 1, 'Minimalis Air Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-7.jpg', 50),
(8, 1, 'Broadcast Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-8.jpg', 50),
(9, 1, 'Justitia Statement Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-9.jpg', 50),
(10, 1, 'Divinus Path Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-10.jpg', 50),
(11, 1, 'Urban Luxe Code Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-7.jpg', 50),
(12, 1, 'Divine Script Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-12.jpg', 50);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `avatar_url` varchar(512) DEFAULT NULL,
  `dark_mode` tinyint(1) NOT NULL DEFAULT 0,
  `font_size` int(11) NOT NULL DEFAULT 50,
  `language` varchar(32) NOT NULL DEFAULT 'English (US)',
  `email_notif` tinyint(1) NOT NULL DEFAULT 1,
  `sms_alerts` tinyint(1) NOT NULL DEFAULT 0,
  `newsletter` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `profile_photo` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `email`, `first_name`, `last_name`, `phone`, `avatar_url`, `dark_mode`, `font_size`, `language`, `email_notif`, `sms_alerts`, `newsletter`, `created_at`, `updated_at`, `two_factor_enabled`, `profile_photo`) VALUES
(1, 'shavindialoka69@gmail.com', 'shavindi', 'Aloka', '0740055050', NULL, 1, 50, 'English (US)', 1, 1, 1, '2026-04-20 06:21:36', '2026-04-20 06:23:14', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_methods`
--

CREATE TABLE `shipping_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_methods`
--

INSERT INTO `shipping_methods` (`id`, `name`, `price`) VALUES
(1, 'Standard', 0.00),
(2, 'Express', 5.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `phone`, `created_at`) VALUES
(1, 'John Wick', 'john@example.com', '123456', 'customer', '0770000001', '2026-03-27 10:50:42'),
(2, 'Shavindi Ridmamali Aloka', 'shavindialoka69@gmail.com', '$2b$10$wJjkRrevkcPL/VJhutNTeu5WGiFFMEX5OEK89oBo0b2ix.roEUrce', 'admin', NULL, '2026-03-30 10:29:24'),
(3, 'Thamidu', 'thamidu1234@gmail.com', '$2b$10$twH.UiTp8FD/E6E6ppUWEuNEQSvBXFj7nFl8ENbitAGT5WCDfFEVu', 'customer', NULL, '2026-04-03 05:58:02'),
(4, 'Shehan', 'shehan1234@gmail.com', '$2b$10$BH6PNk1mwmmMjrbALRSJnOkfpzv5tJtkvbBRANqFkDwIi4YTDZCcG', 'customer', NULL, '2026-04-03 06:03:16'),
(5, 'Nuha', 'nuha1234@gmail.com', '$2b$10$lIBM6fOkEYK/DSNDSHkRwO9yNrZMFF/iaLPwba.NBNuHlq/PZuXoy', 'customer', NULL, '2026-04-09 06:01:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `shipping_method_id` (`shipping_method_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2026 at 06:47 AM
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
-- Database: `hexa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `first_name`, `last_name`, `address_line_1`, `address_line_2`, `city`, `postal_code`, `country`, `phone`) VALUES
(1, 1, 'John', 'Wick', '45 Main Street', 'Apartment 5B', 'Colombo', '00100', 'Sri Lanka', '0770000001');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'T-Shirts'),
(2, 'Hoodies');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 'Alice', 'alice@example.com', 'Order', 'When will my order arrive?', '2026-03-27 10:50:43'),
(2, 'shavindi aloka', 'shavindialoka69@gmail.com', NULL, 'nooooooooooooooooooooooooo', '2026-04-20 06:15:57');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `shipping_method_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `address_id`, `shipping_method_id`, `total`, `status`, `created_at`) VALUES
(1, 1, 1, 1, 39.98, 'pending', '2026-03-27 10:50:42'),
(2, 2, NULL, NULL, 72.84, 'pending', '2026-04-20 05:43:00'),
(3, 2, NULL, NULL, 92.83, 'pending', '2026-04-20 05:43:23'),
(4, 2, NULL, NULL, 192.78, 'pending', '2026-04-20 06:33:52'),
(5, 2, NULL, NULL, 532.61, 'pending', '2026-04-20 06:37:53'),
(6, 2, NULL, NULL, 532.61, 'pending', '2026-04-21 09:16:00'),
(7, 2, NULL, NULL, 552.60, 'pending', '2026-04-21 10:24:01');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, NULL, 1, 19.99),
(2, 1, NULL, 1, 19.99),
(3, 2, 1, 3, 19.99),
(4, 3, 1, 3, 19.99),
(5, 3, 4, 1, 19.99),
(6, 4, 1, 3, 19.99),
(7, 4, 4, 1, 19.99),
(8, 4, 12, 3, 19.99),
(9, 4, 9, 2, 19.99),
(10, 5, 1, 3, 19.99),
(11, 5, 4, 1, 19.99),
(12, 5, 12, 10, 19.99),
(13, 5, 9, 3, 19.99),
(14, 5, 3, 4, 19.99),
(15, 5, 8, 5, 19.99),
(16, 6, 1, 3, 19.99),
(17, 6, 4, 1, 19.99),
(18, 6, 12, 10, 19.99),
(19, 6, 9, 3, 19.99),
(20, 6, 3, 4, 19.99),
(21, 6, 8, 5, 19.99),
(22, 7, 1, 4, 19.99),
(23, 7, 4, 1, 19.99),
(24, 7, 12, 10, 19.99),
(25, 7, 9, 3, 19.99),
(26, 7, 3, 4, 19.99),
(27, 7, 8, 5, 19.99);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `card_last_four` varchar(4) DEFAULT NULL,
  `card_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `payment_method`, `card_last_four`, `card_type`, `status`, `transaction_id`, `created_at`) VALUES
(1, 2, 72.84, 'credit_card', '4242', 'visa', 'completed', 'pi_1776663780725', '2026-04-20 11:13:00'),
(2, 3, 92.83, 'credit_card', '4242', 'visa', 'completed', 'pi_1776663803467', '2026-04-20 11:13:23'),
(3, 4, 192.78, 'credit_card', '4242', 'visa', 'completed', 'pi_1776666832231', '2026-04-20 12:03:52'),
(4, 5, 532.61, 'credit_card', '4242', 'visa', 'completed', 'pi_1776667073242', '2026-04-20 12:07:53'),
(5, 6, 532.61, 'credit_card', '4242', 'visa', 'completed', 'pi_1776762960584', '2026-04-21 14:46:00'),
(6, 7, 552.60, 'credit_card', '4242', 'visa', 'completed', 'pi_1776767041621', '2026-04-21 15:54:01');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(120) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  `stock` int(11) DEFAULT 50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `image`, `stock`) VALUES
(1, 1, 'Veritas Strength Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-1.jpg', 50),
(2, 1, 'Chorale Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-2.jpg', 50),
(3, 1, 'Elan Focus Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-3.jpg', 50),
(4, 1, 'Monogram Grid Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-4.jpg', 50),
(5, 1, 'Racecraft Signature Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t5.jpg', 50),
(6, 2, 'Architecte Blueprint Hoodie', 'Premium hoodie with detailed blueprint design.', 19.99, '/assets/t-6.jpg', 50),
(7, 1, 'Minimalis Air Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-7.jpg', 50),
(8, 1, 'Broadcast Noir Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-8.jpg', 50),
(9, 1, 'Justitia Statement Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-9.jpg', 50),
(10, 1, 'Divinus Path Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-10.jpg', 50),
(11, 1, 'Urban Luxe Code Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-7.jpg', 50),
(12, 1, 'Divine Script Tee', 'Soft cotton tee with a classic cut, perfect for everyday wear.', 19.99, '/assets/t-12.jpg', 50);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `avatar_url` varchar(512) DEFAULT NULL,
  `dark_mode` tinyint(1) NOT NULL DEFAULT 0,
  `font_size` int(11) NOT NULL DEFAULT 50,
  `language` varchar(32) NOT NULL DEFAULT 'English (US)',
  `email_notif` tinyint(1) NOT NULL DEFAULT 1,
  `sms_alerts` tinyint(1) NOT NULL DEFAULT 0,
  `newsletter` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `profile_photo` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `email`, `first_name`, `last_name`, `phone`, `avatar_url`, `dark_mode`, `font_size`, `language`, `email_notif`, `sms_alerts`, `newsletter`, `created_at`, `updated_at`, `two_factor_enabled`, `profile_photo`) VALUES
(1, 'shavindialoka69@gmail.com', 'shavindi', 'Aloka', '0740055050', NULL, 1, 50, 'English (US)', 1, 1, 1, '2026-04-20 06:21:36', '2026-04-20 06:23:14', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping_methods`
--

CREATE TABLE `shipping_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_methods`
--

INSERT INTO `shipping_methods` (`id`, `name`, `price`) VALUES
(1, 'Standard', 0.00),
(2, 'Express', 5.00);

CREATE TABLE profiles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_photo TEXT,
    dark_mode TINYINT(1) DEFAULT 0,
    font_size INT DEFAULT 50,
    language VARCHAR(50) DEFAULT 'English (US)',
    email_notif TINYINT(1) DEFAULT 1,
    two_factor_enabled TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email)
);                                                                                                                                                                                                                                                           CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    priority VARCHAR(10),  -- 'High', 'Low'
    progress INT,          -- 0-100
    date DATE,
    user_id INT,
    status VARCHAR(20),    -- 'new', 'in_progress', 'completed'
    created_at DATETIME
);
-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `phone`, `created_at`) VALUES
(1, 'John Wick', 'john@example.com', '123456', 'customer', '0770000001', '2026-03-27 10:50:42'),
(2, 'Shavindi Ridmamali Aloka', 'shavindialoka69@gmail.com', '$2b$10$wJjkRrevkcPL/VJhutNTeu5WGiFFMEX5OEK89oBo0b2ix.roEUrce', 'admin', NULL, '2026-03-30 10:29:24'),
(3, 'Thamidu', 'thamidu1234@gmail.com', '$2b$10$twH.UiTp8FD/E6E6ppUWEuNEQSvBXFj7nFl8ENbitAGT5WCDfFEVu', 'customer', NULL, '2026-04-03 05:58:02'),
(4, 'Shehan', 'shehan1234@gmail.com', '$2b$10$BH6PNk1mwmmMjrbALRSJnOkfpzv5tJtkvbBRANqFkDwIi4YTDZCcG', 'customer', NULL, '2026-04-03 06:03:16'),
(5, 'Nuha', 'nuha1234@gmail.com', '$2b$10$lIBM6fOkEYK/DSNDSHkRwO9yNrZMFF/iaLPwba.NBNuHlq/PZuXoy', 'customer', NULL, '2026-04-09 06:01:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `shipping_method_id` (`shipping_method_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shipping_methods`
--
ALTER TABLE `shipping_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;

