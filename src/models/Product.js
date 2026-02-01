const db = require('../database');

class Product {
    static findAll() {
        return db.prepare('SELECT id, sku, name, stock, created_at, updated_at FROM products ORDER BY id ASC').all();
    }

    static findBySku(sku) {
        return db.prepare('SELECT id, sku, name, stock, created_at, updated_at FROM products WHERE sku = ?').get(sku);
    }

    static create(sku, name, stock = 0) {
        return db.prepare(`
            INSERT INTO products (sku, name, stock, created_at, updated_at) 
            VALUES (?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
        `).run(sku, name, stock);
    }

    static update(sku, updates) {
        const fields = [];
        const values = [];

        if (updates.name !== undefined) {
            fields.push('name = ?');
            values.push(updates.name);
        }
        if (updates.stock !== undefined) {
            fields.push('stock = ?');
            values.push(updates.stock);
        }

        if (fields.length === 0) return { changes: 0 };

        fields.push("updated_at = datetime('now', 'localtime')");
        values.push(sku);

        return db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE sku = ?`).run(...values);
    }

    static delete(sku) {
        return db.prepare('DELETE FROM products WHERE sku = ?').run(sku);
    }
}

module.exports = Product;
