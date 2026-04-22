const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ordersRoutes = require('./routes/ordersRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cartRoutes = require('./routes/cartRoutes')
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const addressRoutes = require('./routes/addressRoutes');


dotenv.config();
const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/orders', ordersRoutes);
app.use('/api', paymentsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/checkout', addressRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large. Please reduce image size or use a smaller file.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`📸 Image upload limit: 50MB`);
});