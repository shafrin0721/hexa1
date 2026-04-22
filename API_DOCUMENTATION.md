# HEXA Clothing - API Documentation

This document provides a comprehensive guide to all API endpoints for the HEXA Clothing e-commerce platform.

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

### 2. Login User
**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

---

### 3. Logout User
**POST** `/auth/logout`

Logout the current user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Refresh Token
**POST** `/auth/refresh`

Get a new JWT token using an existing token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "message": "Token refreshed",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Product Endpoints

### 1. Get All Products
**GET** `/products`

Retrieve paginated list of all products.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `order` (optional): ASC or DESC (default: DESC)

**Response (200):**
```json
{
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Classic T-Shirt",
      "description": "Comfortable cotton t-shirt",
      "price": 29.99,
      "stock": 50,
      "categoryId": 1,
      "image": "/images/tshirt1.jpg",
      "rating": 4.5,
      "reviews": 120,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "pages": 9
  }
}
```

---

### 2. Get Product by ID
**GET** `/products/:id`

Retrieve detailed information about a specific product.

**Response (200):**
```json
{
  "message": "Product retrieved",
  "data": {
    "id": 1,
    "name": "Classic T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "price": 29.99,
    "stock": 50,
    "categoryId": 1,
    "image": "/images/tshirt1.jpg",
    "rating": 4.5,
    "reviews": 120,
    "reviews": [
      {
        "id": 1,
        "userId": 2,
        "rating": 5,
        "comment": "Great quality!"
      }
    ]
  }
}
```

---

### 3. Get Products by Category
**GET** `/products/category/:categoryId`

Get all products in a specific category.

**Response (200):**
```json
{
  "message": "Products retrieved by category",
  "data": [
    {
      "id": 1,
      "name": "Classic T-Shirt",
      "price": 29.99,
      ...
    }
  ]
}
```

---

### 4. Create Product (Admin Only)
**POST** `/products`

Create a new product.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "stock": 100,
  "categoryId": 1,
  "image": "/images/product.jpg"
}
```

**Response (201):**
```json
{
  "message": "Product created successfully",
  "data": {
    "id": 20
  }
}
```

---

### 5. Update Product (Admin Only)
**PUT** `/products/:id`

Update existing product details.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Updated Product",
  "price": 59.99,
  "stock": 75
}
```

**Response (200):**
```json
{
  "message": "Product updated successfully"
}
```

---

### 6. Delete Product (Admin Only)
**DELETE** `/products/:id`

Delete a product.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## Cart Endpoints

### 1. Get Cart
**GET** `/cart`

Retrieve the current user's shopping cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Cart retrieved",
  "data": {
    "items": [
      {
        "id": 1,
        "productId": 5,
        "quantity": 2,
        "name": "Classic T-Shirt",
        "price": 29.99,
        "image": "/images/tshirt1.jpg"
      }
    ],
    "total": 59.98,
    "itemCount": 1
  }
}
```

---

### 2. Add to Cart
**POST** `/cart/add`

Add an item to the shopping cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": 5,
  "quantity": 2
}
```

**Response (201):**
```json
{
  "message": "Item added to cart"
}
```

---

### 3. Update Cart Item
**PUT** `/cart/:itemId`

Update the quantity of a cart item.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "message": "Cart item updated"
}
```

---

### 4. Remove from Cart
**DELETE** `/cart/:itemId`

Remove an item from the shopping cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Item removed from cart"
}
```

---

### 5. Clear Cart
**DELETE** `/cart`

Remove all items from the shopping cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Cart cleared"
}
```

---

## Order Endpoints

### 1. Create Order
**POST** `/orders`

Place a new order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "totalAmount": 159.96,
  "shippingAddress": "123 Main St, City, Country",
  "paymentMethod": "credit_card",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "data": {
    "orderId": 5
  }
}
```

---

### 2. Get User Orders
**GET** `/orders/user`

Retrieve all orders for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "User orders retrieved",
  "data": [
    {
      "id": 1,
      "userId": 2,
      "totalAmount": 159.96,
      "status": "delivered",
      "shippingAddress": "123 Main St",
      "paymentStatus": "paid",
      "createdAt": "2024-01-10T15:30:00Z"
    }
  ]
}
```

---

### 3. Get Order by ID
**GET** `/orders/:id`

Retrieve detailed information about a specific order.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Order retrieved",
  "data": {
    "id": 1,
    "userId": 2,
    "totalAmount": 159.96,
    "status": "delivered",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "price": 29.99
      }
    ]
  }
}
```

---

### 4. Update Order Status (Admin Only)
**PUT** `/orders/:id`

Update an order's status and payment status.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "paymentStatus": "paid"
}
```

**Response (200):**
```json
{
  "message": "Order updated successfully"
}
```

---

### 5. Delete Order (Admin Only)
**DELETE** `/orders/:id`

Delete an order.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Order deleted successfully"
}
```

---

## User Endpoints

### 1. Get User Profile
**GET** `/user/profile`

Retrieve the current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "User profile retrieved",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "address": "123 Main St, City"
  }
}
```

---

### 2. Update User Profile
**PUT** `/user/profile`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "address": "456 Oak Ave, City"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully"
}
```

---

### 3. Change Password
**PUT** `/user/change-password`

Change the current user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### 4. Get All Users (Admin Only)
**GET** `/user`

Retrieve list of all users (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Users retrieved",
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  ]
}
```

---

### 5. Delete User Account
**DELETE** `/user/account`

Delete the current user's account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (if available)"
}
```

### Common Error Codes:
- **400**: Bad Request - Invalid input or missing required fields
- **401**: Unauthorized - Missing or invalid authentication token
- **403**: Forbidden - Insufficient permissions (e.g., user trying to access admin features)
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server-side error

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added for production.

## CORS

CORS is enabled for requests from the frontend URL specified in `.env` (default: `http://localhost:5173`)

---

**Last Updated**: April 2026