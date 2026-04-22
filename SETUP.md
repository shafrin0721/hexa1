# HEXA Clothing - Setup Guide

This guide will help you set up and run the HEXA Clothing e-commerce platform.

## Prerequisites

- **Node.js**: Version 14+ (Download from [nodejs.org](https://nodejs.org))
- **MySQL**: Version 5.7+ (Download from [mysql.com](https://www.mysql.com/downloads/))
- **Git**: For version control
- **npm**: Comes with Node.js

## Database Setup

### 1. Create Database and Tables

1. Open MySQL Command Line Client or MySQL Workbench
2. Run the SQL scripts:

```bash
# Run schema.sql to create database and tables
mysql -u root -p < database/schema.sql

# Run seed.sql to populate sample data
mysql -u root -p < database/seed.sql
```

Or if using MySQL Workbench:
1. Open `database/schema.sql` in MySQL Workbench
2. Execute the script
3. Open `database/seed.sql` and execute it

## Server Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` folder (copy from `.env.example`):

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hexa_clothing

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# API Configuration
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### 3. Start Server

```bash
# Development mode
npm run dev

# The server will start on http://localhost:5000
```

## Client Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Start Development Server

```bash
npm run dev

# The client will start on http://localhost:5173
```

### 3. Build for Production

```bash
npm run build
```

## Full Stack Development Setup

### Option 1: Run Both Concurrently

From the root directory:

```bash
npm run dev
```

This will start both the server and client simultaneously.

### Option 2: Run Separately

Terminal 1 - Server:
```bash
cd server
npm run dev
```

Terminal 2 - Client:
```bash
cd client
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password
- `GET /api/user` - Get all users (Admin)
- `DELETE /api/user/account` - Delete account

## Default Admin Account

- **Email**: `admin@hexaclothing.com`
- **Password**: `Admin@123`

⚠️ **Important**: Change the admin password after first login!

## Project Structure

```
hexa-clothing/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── context/        # Global state management
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # Stylesheets
│   └── package.json
│
├── server/                  # Node.js Express Backend
│   ├── config/             # Database config
│   ├── controllers/        # Request handlers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Helper functions
│   └── app.js              # Express app setup
│
├── database/               # SQL Scripts
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample data
│
└── .env                    # Environment variables
```

## Troubleshooting

### Issue: Connection refused to database
**Solution**: 
- Ensure MySQL is running: `mysql --version`
- Check database credentials in `.env`
- Verify MySQL service is started

### Issue: Port already in use
**Solution**:
- Change PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

### Issue: Module not found error
**Solution**:
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Issue: CORS errors
**Solution**:
- Verify CLIENT_URL in `.env` matches your frontend URL
- Check CORS middleware in `server/app.js`

## Development Tips

1. **Use Postman** for testing API endpoints
2. **Enable ESLint** in your editor for code quality
3. **Keep `.env` file secure** - Never commit to git
4. **Use meaningful branch names**: `feature/feature-name`, `bugfix/bug-name`
5. **Test thoroughly** before pushing code

## Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [Vite Guide](https://vitejs.dev)

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Last Updated**: April 2026