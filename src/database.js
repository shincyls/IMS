const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../inventory.db');
const db = new Database(dbPath);

// Check if old schema (missing id column), drop and recreate if needed
const tableInfo = db.prepare("PRAGMA table_info(products)").all();
const hasIdColumn = tableInfo.some(col => col.name === 'id');

if (tableInfo.length > 0 && !hasIdColumn) {
  db.prepare('DROP TABLE products').run();
}

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`).run();

module.exports = db;
