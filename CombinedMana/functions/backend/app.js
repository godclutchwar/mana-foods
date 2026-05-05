const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('./db');
const { getStore } = require('@netlify/blobs');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// For local development images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const key = Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, key);
  }
});
const upload = multer({ storage });

// --- ROUTES ---

// 1. Categories
router.get('/categories', async (req, res) => {
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

router.post('/categories', async (req, res) => {
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

router.put('/categories/reorder', async (req, res) => {
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

router.put('/categories/:id', async (req, res) => {
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

router.delete('/categories/:id', async (req, res) => {
  try {
    await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Products
router.get('/products', async (req, res) => {
  try {
    const productsRes = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id');
    const products = productsRes.rows;
    for (let p of products) {
      p.imageUrl = p.image_url;
      const stockRes = await query('SELECT * FROM stock_levels WHERE product_id = $1', [p.id]);
      p.stockLevels = stockRes.rows.map(s => ({
        ...s,
        inStock: (s.inStock !== undefined) ? s.inStock : (s.in_stock !== undefined ? s.in_stock : true)
      }));
      const catRes = await query('SELECT * FROM categories WHERE id = $1', [p.category_id]);
      const cat = catRes.rows[0];
      if (cat) {
        p.category = { id: cat.id, name: cat.name, displayOrder: cat.display_order, imageUrl: cat.image_url, description: cat.description };
      } else {
        p.category = { id: p.category_id, name: p.category_name };
      }
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  const { name, description, imageUrl, category, stockLevels } = req.body;
  if (!category || !category.id) return res.status(400).send("Category ID required");
  try {
    const prodRes = await query('INSERT INTO products (name, description, image_url, category_id) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, imageUrl, category.id]);
    const product = prodRes.rows[0];
    if (stockLevels && Array.isArray(stockLevels)) {
      for (let s of stockLevels) {
        await query('INSERT INTO stock_levels (weight, price, in_stock, product_id) VALUES ($1, $2, $3, $4)', [s.weight, s.price, s.inStock ?? true, product.id]);
      }
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, category } = req.body;
  try {
    const result = await query('UPDATE products SET name = $1, description = $2, image_url = $3, category_id = $4 WHERE id = $5 RETURNING *', [name, description, imageUrl, category?.id, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Stock Levels
router.post('/products/:id/stock', async (req, res) => {
  const { weight, price, inStock } = req.body;
  try {
    const result = await query('INSERT INTO stock_levels (weight, price, in_stock, product_id) VALUES ($1, $2, $3, $4) RETURNING *', [weight, price, inStock ?? true, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/stock/:id/toggle', async (req, res) => {
  try {
    const result = await query('UPDATE stock_levels SET in_stock = NOT in_stock WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/stock/:id/price', async (req, res) => {
  try {
    const result = await query('UPDATE stock_levels SET price = $1 WHERE id = $2 RETURNING *', [req.query.price, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/stock/:id', async (req, res) => {
  const { weight, price, inStock } = req.body;
  try {
    const result = await query('UPDATE stock_levels SET weight = $1, price = $2, in_stock = $3 WHERE id = $4 RETURNING *', [weight, price, inStock, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/stock/:id', async (req, res) => {
  try {
    await query('DELETE FROM stock_levels WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Site Content
router.get('/content', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const result = await query('SELECT * FROM site_content');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/content', async (req, res) => {
  const contents = req.body;
  if (!Array.isArray(contents) || contents.length === 0) return res.status(400).json({ error: 'Expected a non-empty array of content items' });
  try {
    for (const item of contents) {
      if (!item.key) continue;
      await query('INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value', [item.key, item.value ?? '']);
    }
    const result = await query('SELECT * FROM site_content');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Image Upload & Serving
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  const key = req.file.filename;
  const imageUrl = `/uploads/${key}`;
  try {
    const store = getStore('mana-uploads');
    if (store) {
       const fileBuffer = fs.readFileSync(req.file.path);
       await store.set(key, fileBuffer, { metadata: { contentType: req.file.mimetype } });
    }
  } catch (err) { console.warn('Netlify Blobs failed:', err.message); }
  res.json({ imageUrl });
});

// Route to serve blobs as images
router.get('/uploads/:key', async (req, res, next) => {
  const localPath = path.join(__dirname, 'uploads', req.params.key);
  if (fs.existsSync(localPath)) return next();
  const store = getStore('mana-uploads');
  try {
    const blob = await store.get(req.params.key, { type: 'blob' });
    if (!blob) return res.status(404).send('Image not found');
    const ext = path.extname(req.params.key).toLowerCase();
    const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); 
    const arrayBuffer = await blob.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) { res.status(500).send('Error fetching image'); }
});

router.get('/status', (req, res) => {
  res.json({ 
    mode: require('./db').getMode(),
    timestamp: new Date().toISOString(),
    dbConnected: !!require('./db').pool || require('./db').getMode() === 'mock'
  });
});

router.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    originalUrl: req.originalUrl,
    method: req.method
  });
});

app.use(['/api', '/.netlify/functions/api', '/'], router);

module.exports = app;
