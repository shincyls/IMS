const Product = require('../models/Product');

class ProductController {
    // Get all products
    static getAllProducts() {
        try {
            const products = Product.findAll();
            return {
                success: true,
                data: products,
                message: products.length > 0
                    ? `Found ${products.length} product(s)`
                    : 'No products found'
            };
        } catch (err) {
            return {
                success: false,
                message: `Error fetching products: ${err.message}`
            };
        }
    }

    // Get a single product by SKU
    static getProduct(sku) {
        try {
            if (!sku) {
                return {
                    success: false,
                    message: 'SKU is required'
                };
            }

            const product = Product.findBySku(sku.toUpperCase());
            if (product) {
                return {
                    success: true,
                    data: product,
                    message: 'Product found'
                };
            } else {
                return {
                    success: false,
                    message: `Product with SKU '${sku}' not found`
                };
            }
        } catch (err) {
            return {
                success: false,
                message: `Error fetching product: ${err.message}`
            };
        }
    }

    // Add a new product
    static addProduct(sku, name, stock = 0) {
        try {
            if (!sku || !name) {
                return {
                    success: false,
                    message: 'SKU and Name are required'
                };
            }

            const normalizedSku = sku.toUpperCase();
            const normalizedStock = parseInt(stock) || 0;

            // Check if product already exists
            const existing = Product.findBySku(normalizedSku);
            if (existing) {
                return {
                    success: false,
                    message: `Product with SKU '${normalizedSku}' already exists`
                };
            }

            Product.create(normalizedSku, name.trim(), normalizedStock);
            const newProduct = Product.findBySku(normalizedSku);

            return {
                success: true,
                data: newProduct,
                message: `Product '${name}' (SKU: ${normalizedSku}) added with stock ${normalizedStock}`
            };
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
                return {
                    success: false,
                    message: `Product with SKU '${sku}' already exists`
                };
            }
            return {
                success: false,
                message: `Error adding product: ${err.message}`
            };
        }
    }

    // Update product fields
    static updateProduct(sku, updates) {
        try {
            if (!sku) {
                return {
                    success: false,
                    message: 'SKU is required'
                };
            }

            const normalizedSku = sku.toUpperCase();

            // Check if product exists
            const existing = Product.findBySku(normalizedSku);
            if (!existing) {
                return {
                    success: false,
                    message: `Product with SKU '${normalizedSku}' not found`
                };
            }

            const result = Product.update(normalizedSku, updates);
            if (result.changes > 0) {
                const updatedProduct = Product.findBySku(normalizedSku);
                return {
                    success: true,
                    data: updatedProduct,
                    message: `Product SKU '${normalizedSku}' updated successfully`
                };
            } else {
                return {
                    success: false,
                    message: 'No changes made'
                };
            }
        } catch (err) {
            return {
                success: false,
                message: `Error updating product: ${err.message}`
            };
        }
    }

    // Delete a product
    static deleteProduct(sku) {
        try {
            if (!sku) {
                return {
                    success: false,
                    message: 'SKU is required'
                };
            }

            const normalizedSku = sku.toUpperCase();

            // Check if product exists
            const existing = Product.findBySku(normalizedSku);
            if (!existing) {
                return {
                    success: false,
                    message: `Product with SKU '${normalizedSku}' not found`
                };
            }

            const result = Product.delete(normalizedSku);
            if (result.changes > 0) {
                return {
                    success: true,
                    data: existing,
                    message: `Product SKU '${normalizedSku}' deleted successfully`
                };
            } else {
                return {
                    success: false,
                    message: `Failed to delete product SKU '${normalizedSku}'`
                };
            }
        } catch (err) {
            return {
                success: false,
                message: `Error deleting product: ${err.message}`
            };
        }
    }

    // Get help information
    static getHelp() {
        return {
            success: true,
            message: `Commands:
  show all                    Show all products
  show <SKU>                  Show one product
  add <SKU>,<Name>[,Stock]    Add product (stock default: 0)
  del <SKU>                   Delete product
  mod <SKU> --stock <value>   Update stock
  help                        Show this menu
  exit                        Exit`
        };
    }
}

module.exports = ProductController;
