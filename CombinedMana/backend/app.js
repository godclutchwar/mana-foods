const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('./db');
const { getStore } = require('@netlify/blobs');

const app = express();

app.use(cors());
app.use(express.json());

// For local development images
// For local development images
// app.use('/uploads', express.static('uploads'));

// Multer for file uploads (Memory Storage for Netlify Blobs)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- ROUTES ---

// 1. Categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY display_order ASC');
    // Map snake_case to camelCase for frontend
    const mapped = result.rows.map(c => ({
      ...c,
      displayOrder: c.display_order,
      imageUrl: c.image_url
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  const { name, description, imageUrl, displayOrder } = req.body;
  try {
    const result = await query(
      'INSERT INTO categories (name, description, image_url, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, imageUrl, displayOrder || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/reorder', async (req, res) => {
  const categories = req.body;
  try {
    for (const cat of categories) {
      await query('UPDATE categories SET display_order = $1 WHERE id = $2', [cat.displayOrder, cat.id]);
    }
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, displayOrder } = req.body;
  try {
    const result = await query(
      'UPDATE categories SET name = $1, description = $2, image_url = $3, display_order = $4 WHERE id = $5 RETURNING *',
      [name, description, imageUrl, displayOrder, id]
    );
    if (result.rowCount === 0) return res.status(404).send();
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Products
app.get('/api/products', async (req, res) => {
  try {
    // Nested products with stock levels - simple joined approach or separate queries
    const productsRes = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id');
    const products = productsRes.rows;
    
    // For each product, get stock levels
    for (let p of products) {
      const stockRes = await query('SELECT * FROM stock_levels WHERE product_id = $1', [p.id]);
      p.stockLevels = stockRes.rows.map(s => ({
        ...s,
        inStock: (s.inStock !== undefined) ? s.inStock : (s.in_stock !== undefined ? s.in_stock : true)
      }));
      // Map naming for frontend compatibility if needed
      // Fetch full category info including display_order
      const catRes = await query('SELECT * FROM categories WHERE id = $1', [p.category_id]);
      const cat = catRes.rows[0];
      if (cat) {
        p.category = { 
          id: cat.id, 
          name: cat.name,
          displayOrder: cat.display_order,
          imageUrl: cat.image_url,
          description: cat.description
        };
      } else {
        p.category = { id: p.category_id, name: p.category_name };
      }
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, description, imageUrl, category, stockLevels } = req.body;
  if (!category || !category.id) return res.status(400).send("Category ID required");
  
  try {
    const prodRes = await query(
      'INSERT INTO products (name, description, image_url, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, imageUrl, category.id]
    );
    const product = prodRes.rows[0];
    
    if (stockLevels && Array.isArray(stockLevels)) {
      for (let s of stockLevels) {
        await query(
          'INSERT INTO stock_levels (weight, price, in_stock, product_id) VALUES ($1, $2, $3, $4)',
          [s.weight, s.price, s.inStock ?? true, product.id]
        );
      }
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, category } = req.body;
  try {
    const result = await query(
      'UPDATE products SET name = $1, description = $2, image_url = $3, category_id = $4 WHERE id = $5 RETURNING *',
      [name, description, imageUrl, category?.id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Stock Levels
app.post('/api/products/:id/stock', async (req, res) => {
  const { weight, price, inStock } = req.body;
  try {
    const result = await query(
      'INSERT INTO stock_levels (weight, price, in_stock, product_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [weight, price, inStock ?? true, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stock/:id/toggle', async (req, res) => {
  try {
    const result = await query('UPDATE stock_levels SET in_stock = NOT in_stock WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stock/:id/price', async (req, res) => {
  try {
    const result = await query('UPDATE stock_levels SET price = $1 WHERE id = $2 RETURNING *', [req.query.price, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stock/:id', async (req, res) => {
  const { weight, price, inStock } = req.body;
  try {
    const result = await query(
      'UPDATE stock_levels SET weight = $1, price = $2, in_stock = $3 WHERE id = $4 RETURNING *',
      [weight, price, inStock, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stock/:id', async (req, res) => {
  try {
    await query('DELETE FROM stock_levels WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Site Content
app.get('/api/content', async (req, res) => {
  try {
    const result = await query('SELECT * FROM site_content');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/content', async (req, res) => {
  const contents = req.body;
  try {
    for (let item of contents) {
      await query(
        'INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
        [item.key, item.value]
      );
    }
    res.send("Published");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Image Upload & Serving
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  
  const key = Date.now() + '_' + req.file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
  const store = getStore('mana-uploads');
  
  try {
    await store.set(key, req.file.buffer, {
      metadata: { contentType: req.file.mimetype }
    });
    const imageUrl = `/uploads/${key}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error('Blob Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to serve blobs as images
app.get('/uploads/:key', async (req, res) => {
  const store = getStore('mana-uploads');
  try {
    const blob = await store.get(req.params.key, { type: 'blob' });
    if (!blob) return res.status(404).send('Image not found');
    
    const ext = path.extname(req.params.key).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    const arrayBuffer = await blob.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Blob Fetch Error:', err);
    res.status(500).send('Error fetching image');
  }
});

module.exports = app;
