const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

// Get All Products
router.get('/products', (req, res) => {
    const result = ProductController.getAllProducts();
    res.status(result.success ? 200 : 500).json(result);
});

// Get Product by SKU
router.get('/products/:sku', (req, res) => {
    const result = ProductController.getProduct(req.params.sku);
    res.status(result.success ? 200 : 404).json(result);
});

// Add Product
router.post('/products', (req, res) => {
    const { sku, name, stock } = req.body;
    const result = ProductController.addProduct(sku, name, stock);
    res.status(result.success ? 201 : 400).json(result);
});

// Update Product by SKU
router.put('/products/:sku', (req, res) => {
    const updates = {};
    if (req.body.stock !== undefined) updates.stock = req.body.stock;
    if (req.body.name !== undefined) updates.name = req.body.name;

    const result = ProductController.updateProduct(req.params.sku, updates);
    res.status(result.success ? 200 : 404).json(result);
});

// Delete Product by SKU
router.delete('/products/:sku', (req, res) => {
    const result = ProductController.deleteProduct(req.params.sku);
    res.status(result.success ? 200 : 404).json(result);
});

module.exports = router;
