-- Seed Data for HEXA Clothing

USE hexa_clothing;

-- Insert Categories
INSERT INTO categories (name, description, image) VALUES
('Men', 'Mens clothing and accessories', '/images/men.jpg'),
('Women', 'Womens clothing and accessories', '/images/women.jpg'),
('Kids', 'Kids clothing and accessories', '/images/kids.jpg'),
('Accessories', 'Bags, belts, and other accessories', '/images/accessories.jpg'),
('Footwear', 'Shoes and footwear', '/images/footwear.jpg');

-- Insert Sample Products (Men)
INSERT INTO products (name, description, price, stock, categoryId, image, rating, reviews) VALUES
('Classic T-Shirt', 'Comfortable 100% cotton t-shirt', 29.99, 50, 1, '/images/tshirt1.jpg', 4.5, 120),
('Slim Fit Jeans', 'Modern slim fit denim jeans', 79.99, 30, 1, '/images/jeans1.jpg', 4.7, 85),
('Casual Polo', 'Premium quality polo shirt', 49.99, 40, 1, '/images/polo1.jpg', 4.3, 60),
('Winter Jacket', 'Warm and stylish winter jacket', 149.99, 25, 1, '/images/jacket1.jpg', 4.8, 95);

-- Insert Sample Products (Women)
INSERT INTO products (name, description, price, stock, categoryId, image, rating, reviews) VALUES
('Summer Dress', 'Light and breathable summer dress', 59.99, 35, 2, '/images/dress1.jpg', 4.6, 110),
('Designer Jeans', 'High quality designer jeans', 99.99, 20, 2, '/images/jeans2.jpg', 4.9, 75),
('Casual Blouse', 'Elegant casual blouse', 44.99, 45, 2, '/images/blouse1.jpg', 4.4, 70),
('Evening Gown', 'Stunning evening gown', 199.99, 15, 2, '/images/gown1.jpg', 5.0, 40);

-- Insert Sample Products (Kids)
INSERT INTO products (name, description, price, stock, categoryId, image, rating, reviews) VALUES
('Kids T-Shirt', 'Fun and colorful kids t-shirt', 19.99, 60, 3, '/images/kids-tshirt.jpg', 4.5, 50),
('Kids Jeans', 'Durable kids jeans', 39.99, 50, 3, '/images/kids-jeans.jpg', 4.6, 45),
('Kids Hoodie', 'Cozy kids hoodie', 34.99, 40, 3, '/images/kids-hoodie.jpg', 4.7, 55);

-- Insert Sample Products (Accessories)
INSERT INTO products (name, description, price, stock, categoryId, image, rating, reviews) VALUES
('Leather Belt', 'Premium leather belt', 34.99, 70, 4, '/images/belt1.jpg', 4.8, 30),
('Canvas Backpack', 'Durable canvas backpack', 69.99, 35, 4, '/images/backpack1.jpg', 4.7, 85),
('Sunglasses', 'UV protection sunglasses', 79.99, 50, 4, '/images/sunglasses1.jpg', 4.6, 60),
('Watch', 'Elegant analog watch', 129.99, 25, 4, '/images/watch1.jpg', 4.9, 100);

-- Insert Sample Products (Footwear)
INSERT INTO products (name, description, price, stock, categoryId, image, rating, reviews) VALUES
('Running Shoes', 'Comfortable running shoes', 89.99, 40, 5, '/images/shoes1.jpg', 4.8, 120),
('Casual Sneakers', 'Stylish casual sneakers', 59.99, 50, 5, '/images/sneakers1.jpg', 4.7, 90),
('Formal Shoes', 'Elegant formal leather shoes', 119.99, 30, 5, '/images/formal-shoes.jpg', 4.9, 75),
('Sandals', 'Comfortable summer sandals', 34.99, 60, 5, '/images/sandals1.jpg', 4.5, 50);

-- Insert Sample Admin User
INSERT INTO users (email, password, firstName, lastName, role) VALUES
('admin@hexaclothing.com', '$2a$10$AhLqMPxrW8cF.sK.6Q5PqeEpY.8KjGqWe3VNTvRJ7d1B3QjVR9Gu2', 'Admin', 'User', 'admin');
-- Password: Admin@123

-- Insert Sample Regular Users
INSERT INTO users (email, password, firstName, lastName, phone, address, role) VALUES
('user1@example.com', '$2a$10$AhLqMPxrW8cF.sK.6Q5PqeEpY.8KjGqWe3VNTvRJ7d1B3QjVR9Gu2', 'John', 'Doe', '1234567890', '123 Main St, City, Country', 'user'),
('user2@example.com', '$2a$10$AhLqMPxrW8cF.sK.6Q5PqeEpY.8KjGqWe3VNTvRJ7d1B3QjVR9Gu2', 'Jane', 'Smith', '0987654321', '456 Oak Ave, City, Country', 'user');

-- Insert Sample Orders
INSERT INTO orders (userId, totalAmount, status, shippingAddress, paymentMethod, paymentStatus) VALUES
(2, 159.96, 'delivered', '123 Main St, City, Country', 'credit_card', 'paid'),
(3, 249.97, 'shipped', '456 Oak Ave, City, Country', 'credit_card', 'paid');

-- Insert Sample Order Items
INSERT INTO orderItems (orderId, productId, quantity, price) VALUES
(1, 1, 2, 29.99),
(1, 3, 1, 49.99),
(2, 6, 1, 99.99),
(2, 8, 1, 199.99);

-- Insert Sample Reviews
INSERT INTO reviews (productId, userId, rating, comment) VALUES
(1, 2, 5, 'Excellent quality and fit!'),
(1, 3, 4, 'Great t-shirt, very comfortable'),
(3, 2, 5, 'Perfect polo shirt!'),
(6, 3, 5, 'Love this dress, very elegant');
