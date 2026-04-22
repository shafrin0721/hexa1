const pool = require('../config/db');

const getAllProducts = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.stock,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `);

    const products = rows.map(product => ({
      ...product,
      variants: [], // Empty array since no variants table
      avg_rating: "0.0", // Default rating since no reviews table
      review_count: 0
    }));

    res.json(products);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*, 
        c.name AS category 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get variants if table exists
    let variants = [];
    try {
      const [variantRows] = await pool.query(
        'SELECT size, color, stock FROM product_variants WHERE product_id = ?',
        [req.params.id]
      );
      variants = variantRows;
    } catch (err) {
      // Variants table doesn't exist, just use empty array
      console.log('Variants table not found, skipping');
    }
    
    res.json({
      ...rows[0],
      variants
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

module.exports = { getAllProducts, getProductById };