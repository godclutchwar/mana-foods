const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;
let useMock = false;
let mockData = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });
} else {
  console.log('No DATABASE_URL found. Using local data.json mock.');
  useMock = true;
}

const loadMockData = () => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(dataPath)) {
        mockData = { site_content: [], categories: [], products: [], stock_levels: [] };
        return;
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    mockData = JSON.parse(data);
  } catch (err) {
    console.error('Failed to load mock data:', err.message);
    mockData = { site_content: [], categories: [], products: [], stock_levels: [] };
  }
};

const saveMockData = () => {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        fs.writeFileSync(dataPath, JSON.stringify(mockData, null, 2), 'utf8');
    } catch (err) {
        console.error('Failed to save mock data:', err.message);
    }
};

if (useMock) loadMockData();

const query = async (text, params) => {
  if (useMock) {
    // Basic mock query implementation for common requests
    const t = text.toLowerCase();
    if (t.includes('select * from site_content')) return { rows: mockData.site_content };
    if (t.includes('select * from categories where id =')) {
        const cid = params[0];
        const cat = mockData.categories.find(c => Number(c.id) === Number(cid));
        return { rows: cat ? [cat] : [] };
    }
    if (t.includes('select * from categories')) {
        return { rows: [...mockData.categories].sort((a,b)=>(a.display_order || 0) - (b.display_order || 0)) };
    }
    if (t.includes('select p.*, c.name')) {
        return { rows: mockData.products.map(p => ({
            ...p,
            category_name: mockData.categories.find(c => c.id === p.category_id)?.name || 'Unknown'
        })) };
    }
    if (t.includes('select * from stock_levels where product_id')) {
        const pid = params[0];
        return { rows: mockData.stock_levels.filter(s => s.product_id === pid) };
    }
    
    // Support updates for reordering and status toggle
    if (t.includes('update categories set display_order')) {
        const [order, id] = params;
        const cat = mockData.categories.find(c => Number(c.id) === Number(id));
        if (cat) cat.display_order = order;
        saveMockData();
        return { rowCount: 1 };
    }
    if (t.includes('update stock_levels set in_stock')) {
        const [id] = params;
        const stock = mockData.stock_levels.find(s => Number(s.id) === Number(id));
        if (stock) stock.inStock = !stock.inStock;
        saveMockData();
        return { rows: [stock], rowCount: 1 };
    }
    if (t.includes('update stock_levels set price')) {
        const [price, id] = params;
        const stock = mockData.stock_levels.find(s => Number(s.id) === Number(id));
        if (stock) stock.price = parseFloat(price);
        saveMockData();
        return { rows: [stock], rowCount: 1 };
    }
    if (t.includes('update stock_levels set weight')) {
      const [weight, price, inStock, id] = params;
      const stock = mockData.stock_levels.find(s => Number(s.id) === Number(id));
      if (stock) {
        stock.weight = weight;
        stock.price = price;
        stock.inStock = inStock;
      }
      saveMockData();
      return { rows: [stock], rowCount: 1 };
    }
    if (t.includes('update products set name')) {
      const [name, desc, img, catId, id] = params;
      const prod = mockData.products.find(p => Number(p.id) === Number(id));
      if (prod) {
        prod.name = name;
        prod.description = desc;
        prod.image_url = img;
        prod.category_id = catId;
      }
      saveMockData();
      return { rows: [prod], rowCount: 1 };
    }
    if (t.includes('delete from stock_levels where id')) {
      const [id] = params;
      mockData.stock_levels = mockData.stock_levels.filter(s => Number(s.id) !== Number(id));
      saveMockData();
      return { rowCount: 1 };
    }
    if (t.includes('delete from products where id')) {
      const [id] = params;
      mockData.products = mockData.products.filter(p => Number(p.id) !== Number(id));
      saveMockData();
      return { rowCount: 1 };
    }

    if (t.includes('insert into site_content')) {
      const [key, value] = params;
      const existing = mockData.site_content.find(s => s.key === key);
      if (existing) {
        existing.value = value;
      } else {
        mockData.site_content.push({ key, value });
      }
      saveMockData();
      return { rows: [], rowCount: 1 };
    }
    if (t.includes('insert into categories')) {
      const [name, img, desc, order] = params;
      const newId = (mockData.categories.length > 0 ? Math.max(...mockData.categories.map(c => Number(c.id))) : 0) + 1;
      const newCat = { id: newId, name, image_url: img, description: desc, display_order: order };
      mockData.categories.push(newCat);
      saveMockData();
      return { rows: [newCat], rowCount: 1 };
    }
    if (t.includes('insert into products')) {
      const [name, desc, img, catId] = params;
      const newId = (mockData.products.length > 0 ? Math.max(...mockData.products.map(p => Number(p.id))) : 0) + 1;
      const newProd = { id: newId, name, description: desc, image_url: img, category_id: catId };
      mockData.products.push(newProd);
      saveMockData();
      return { rows: [newProd], rowCount: 1 };
    }
    if (t.includes('insert into stock_levels')) {
      const [weight, price, inStock, productId] = params;
      const newId = (mockData.stock_levels.length > 0 ? Math.max(...mockData.stock_levels.map(s => Number(s.id))) : 0) + 1;
      const newStock = { id: newId, weight, price, inStock, product_id: productId };
      mockData.stock_levels.push(newStock);
      saveMockData();
      return { rows: [newStock], rowCount: 1 };
    }
    
    // For other queries (POST/PUT), just return success
    return { rows: [], rowCount: 0 };

  }
  
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('DB Connection failed. Swapping to mock mode.', err.message);
    useMock = true; // Switch to mock for future calls
    if (!mockData) loadMockData();
    return query(text, params); 
  }
};

const initDb = async () => {
  if (useMock) return;
  
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS stock_levels (
      id SERIAL PRIMARY KEY,
      weight TEXT,
      price DECIMAL(10, 2),
      in_stock BOOLEAN DEFAULT TRUE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT
    );
  `);

  // Seeding from data.json if empty
  try {
    const catCheck = await query('SELECT count(*) FROM categories');
    if (parseInt(catCheck.rows[0].count) === 0) {
      console.log('Database empty. Seeding from data.json...');
      const dataPath = path.join(__dirname, 'data.json');
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        // Seed Categories
        for (const cat of data.categories) {
          await query('INSERT INTO categories (id, name, description, image_url, display_order) VALUES ($1,$2,$3,$4,$5)', 
            [cat.id, cat.name, cat.description, cat.image_url, cat.display_order || 0]);
        }
        
        // Seed Products
        for (const prod of data.products) {
          await query('INSERT INTO products (id, name, description, image_url, category_id) VALUES ($1,$2,$3,$4,$5)', 
            [prod.id, prod.name, prod.description, prod.image_url, prod.category_id]);
        }
        
        // Seed Stock
        for (const s of data.stock_levels) {
          const inStock = s.inStock !== undefined ? s.inStock : (s.in_stock !== undefined ? s.in_stock : true);
          await query('INSERT INTO stock_levels (id, weight, price, in_stock, product_id) VALUES ($1,$2,$3,$4,$5)', 
            [s.id, s.weight, s.price, inStock, s.product_id]);
        }
        
        // Seed Site Content
        if (data.site_content) {
          for (const item of data.site_content) {
            await query('INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [item.key, item.value]);
          }
        }

        // Fix Sequences
        await query("SELECT setval(pg_get_serial_sequence('categories', 'id'), COALESCE((SELECT MAX(id) FROM categories), 1))");
        await query("SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE((SELECT MAX(id) FROM products), 1))");
        await query("SELECT setval(pg_get_serial_sequence('stock_levels', 'id'), COALESCE((SELECT MAX(id) FROM stock_levels), 1))");
        await query("SELECT setval(pg_get_serial_sequence('site_content', 'id'), COALESCE((SELECT MAX(id) FROM site_content), 1))");
        
        console.log('Seeding complete.');
      }
    }
  } catch (err) {
    console.error('Seeding skipped or failed:', err.message);
  }
};

module.exports = {
  query,
  pool,
  initDb
};
