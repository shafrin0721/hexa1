# HEXA Clothing - Project Structure Guide

This document provides a detailed explanation of the project folder structure and conventions used in the HEXA Clothing e-commerce platform.

## Overall Project Structure

```
hexa-clothing/
├── client/                  # React Frontend (Vite)
├── server/                  # Node.js Express Backend
├── database/                # SQL Scripts
├── package.json             # Root dependencies
├── .env                     # Environment variables (from .env.example)
├── .gitignore              # Git ignore rules
├── README.md               # Project overview
├── SETUP.md                # Setup instructions
├── STRUCTURE.md            # This file
└── API_DOCUMENTATION.md    # API reference
```

---

## CLIENT FOLDER (`/client`)

### Purpose
React frontend built with Vite for fast development and optimized production builds.

### Structure

```
client/
├── public/
│   ├── icons/              # SVG/PNG icons
│   ├── images/             # Static product images
│   └── robots.txt
│
├── src/
│   ├── assets/             # Fonts, icons, static files
│   │
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── layout/         # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── ui/             # Figma-based UI blocks
│   │       ├── Banner.jsx
│   │       ├── CategoryCard.jsx
│   │       └── ProductCard.jsx
│   │
│   ├── context/            # Global state management
│   │   ├── AuthContext.jsx    # User authentication state
│   │   └── CartContext.jsx    # Shopping cart state
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.js      # Authentication hook
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── checkout.jsx
│   │   ├── checkout.css
│   │   ├── ShippingStep.jsx
│   │   ├── shipping.css
│   │   ├── OrderSuccess.jsx
│   │   ├── OrderSummary.jsx
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   └── Register.jsx
│   │
│   ├── routes/             # Route configuration
│   │   └── AppRoutes.jsx   # Main routing setup
│   │
│   ├── services/           # API service functions
│   │   ├── api.js             # Axios instance with interceptors
│   │   ├── authService.js     # Auth API calls
│   │   ├── productService.js  # Product API calls
│   │   ├── cartService.js     # Cart API calls
│   │   └── orderService.js    # Order API calls
│   │
│   ├── utils/              # Helper functions
│   │   └── helpers.js
│   │
│   ├── styles/             # Global styles
│   │   └── globals.css
│   │
│   ├── App.jsx             # Root component
│   ├── App.css
│   ├── index.css           # Entry styles
│   ├── main.jsx            # Entry point
│   ├── vite-env.d.ts       # Vite types
│   └── tailwind.config.js  # Tailwind config
│
├── index.html              # HTML template
├── package.json            # React dependencies
├── postcss.config.js       # PostCSS config
├── vite.config.js          # Vite build config
├── eslint.config.js        # ESLint rules
└── README.md
```

### File Conventions

**Components:**
- Filename: PascalCase (e.g., `ProductCard.jsx`)
- Props destructuring: `const MyComponent = ({ prop1, prop2 }) => {}`
- File organization: One component per file

**Services:**
- Filename: camelCase with .js extension (e.g., `authService.js`)
- Export functions as named exports
- Use async/await for API calls
- Always handle errors with try-catch

**Styles:**
- CSS files alongside components: `Component.jsx` + `Component.css`
- Global styles in `/styles/globals.css`
- Tailwind classes for utility-first approach

---

## SERVER FOLDER (`/server`)

### Purpose
Express.js backend providing REST API for the React frontend.

### Structure

```
server/
├── config/
│   └── db.js               # MySQL database connection pool
│
├── controllers/            # Business logic handlers
│   ├── authController.js   # Auth handlers
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── userController.js
│
├── routes/                 # API endpoint definitions
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   └── user.routes.js
│
├── models/                 # Data models (SQL ORM-style)
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
│
├── middleware/             # Custom middleware functions
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Global error handling
│
├── utils/                  # Helper functions
│   ├── helpers.js
│   └── validators.js       # Input validation functions
│
├── app.js                  # Express app configuration
├── server.js               # Server entry point (with DB connection)
├── package.json            # Dependencies
└── node_modules/           # Installed packages
```

### File Conventions

**Routes:**
- Filename: `<resource>.routes.js`
- Example: `user.routes.js` for `/api/user` endpoints
- Return consistent JSON response structure

**Controllers:**
- Filename: `<resource>Controller.js`
- Export named functions for each route handler
- Handle all business logic and validation
- Required params at top of function

**Example Pattern:**
```javascript
// routes
router.post('/create', auth, userController.createUser);

// controller
exports.createUser = async (req, res) => {
    try {
        // Logic here
        res.status(201).json({ message: 'Success', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};
```

**Database Queries:**
- Use connection pool for efficiency
- Always use parameterized queries to prevent SQL injection
- Example: `pool.query('SELECT * FROM users WHERE id = ?', [userId])`

---

## DATABASE FOLDER (`/database`)

### Purpose
Contains SQL scripts for database setup and sample data.

### Files

#### `schema.sql`
Creates and initializes the database structure:
- **Tables**: users, categories, products, cartItems, orders, orderItems, reviews, wishlist, adminLogs
- **Relationships**: Foreign keys, constraints
- **Indexes**: For optimized queries

Key tables:
- Users: Stores user accounts
- Products: Product catalog
- Orders: Order history
- CartItems: Shopping cart data

#### `seed.sql`
Populates the database with sample data:
- Sample users (admin and regular users)
- Sample products in different categories
- Sample orders and reviews
- Test data for development

**Default Admin Account:**
- Email: `admin@hexaclothing.com`
- Password: `Admin@123`

---

## ROOT LEVEL FILES

### `package.json`
Root package configuration with scripts to manage both frontend and backend:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\"",
    "start": "npm run start --prefix server",
    "build": "npm run build --prefix client",
    "install-client": "npm install --prefix client",
    "install-server": "npm install --prefix server"
  }
}
```

### `.env`
Environment configuration variables (NOT in Git):
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hexa_clothing
JWT_SECRET=your_secret_key
```

### `.gitignore`
Files excluded from version control:
- `node_modules/`
- `.env`
- `dist/` (build output)
- `.vscode/` (editor settings)

### `README.md`
Project overview and quick start guide

### `SETUP.md`
Detailed setup instructions with troubleshooting

### `API_DOCUMENTATION.md`
Complete API endpoint reference

---

## ENVIRONMENT VARIABLES

### Required for Development
```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=hexa_clothing

# JWT
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d

# URLs
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### Production Considerations
- Use strong JWT_SECRET (minimum 32 characters)
- Use environment-specific databases
- Enable HTTPS
- Add rate limiting
- Configure CORS properly

---

## DATA FLOW

### User Registration/Login
```
Client (Register Form)
    ↓
AuthService.register/login
    ↓
/api/auth/register or /api/auth/login
    ↓
authController (validation, hashing, token generation)
    ↓
Database (users table)
    ↓
Return token + user data
    ↓
localStorage.setItem('token', token)
    ↓
Update AuthContext with user data
```

### Product Browsing
```
Client (Products Page)
    ↓
productService.getAllProducts()
    ↓
GET /api/products?page=1&limit=12
    ↓
productController.getAllProducts()
    ↓
Database (products table with pagination)
    ↓
Return products array + pagination info
```

### Shopping Cart
```
Client (ProductCard)
    ↓
cartService.addToCart(productId, quantity)
    ↓
POST /api/cart/add
    ↓
auth middleware (validates token)
    ↓
cartController.addToCart()
    ↓
Database (cartItems table)
    ↓
Update CartContext on Frontend
```

### Placing Order
```
Client (Checkout)
    ↓
orderService.createOrder(orderData)
    ↓
POST /api/orders
    ↓
orderController.createOrder()
    ↓
Validate cart items
    ↓
Create order in orders table
    ↓
Add items to orderItems table
    ↓
Clear cart for user
    ↓
Return order ID + success message
```

---

## NAMING CONVENTIONS

### Database Tables & Columns
- Table: PascalCase (e.g., `cartItems`)
- `id` (Primary key)
- Foreign keys: `<TableName>Id` (e.g., `userId`, `productId`)
- Timestamps: `createdAt`, `updatedAt`
- Boolean: `is<Action>` (e.g., `isActive`)

### API Endpoints
- Resource: Plural (e.g., `/api/products`)
- Sub-resources: `/api/products/:id/reviews`
- Actions: Use HTTP verbs, not in URL
  - `POST /products` (create)
  - `GET /products` (list)
  - `GET /products/:id` (read)
  - `PUT /products/:id` (update)
  - `DELETE /products/:id` (delete)

### Function Names
- Controllers: `<action><Resource>` (e.g., `getProduct`, `createProduct`)
- Services: `<action>` (e.g., `getProduct`, `createProduct`)
- Utils: Descriptive verb-noun (e.g., `formatPrice`, `validateEmail`)

---

## BEST PRACTICES

### Frontend
- ✓ Use Context API for global state
- ✓ Store auth tokens in localStorage
- ✓ Implement loading and error states
- ✓ Use form validation before API calls
- ✓ Implement auto-logout on token expiry

### Backend
- ✓ Use parameterized queries (prevent SQL injection)
- ✓ Validate input on server side
- ✓ Never log sensitive data
- ✓ Use connection pooling for DB
- ✓ Implement proper error handling
- ✓ Use appropriate HTTP status codes

### Database
- ✓ Use foreign keys for referential integrity
- ✓ Create indexes on frequently queried columns
- ✓ Use transactions for multi-step operations
- ✓ Backup regularly

### General
- ✓ Always use `.env.example` for sensitive defaults
- ✓ Write meaningful commit messages
- ✓ Use consistent code formatting
- ✓ Document complex logic
- ✓ Keep services and logic separate

---

## COMMON ISSUES & SOLUTIONS

**Issue**: CORS errors
- **Solution**: Check `CLIENT_URL` in `.env` matches frontend URL

**Issue**: 404 on API calls
- **Solution**: Verify route path in controller export and route definition

**Issue**: Database connection fails
- **Solution**: Verify DB credentials in `.env` and MySQL is running

**Issue**: Token expired/invalid
- **Solution**: Implement token refresh mechanism or logout user

---

**Last Updated**: April 2026