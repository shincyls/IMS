const args = process.argv;
const isCliMode = args.includes('--cli');

if (isCliMode) {
    // CLI Mode
    console.log('Starting IMS in CLI Mode...\n');
    const startInteractiveMode = require('./src/routes/cliRouter');
    startInteractiveMode();
} else {
    // Web Server Mode
    console.log('Starting IMS in Web Server Mode...\n');

    const express = require('express');
    const apiRouter = require('./src/routes/apiRouter');

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', apiRouter);

    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Inventory Management System API',
            version: '1.0.0',
            endpoints: {
                'GET /api/products': 'Get all products',
                'GET /api/products/:sku': 'Get product by SKU',
                'POST /api/products': 'Add new product',
                'PUT /api/products/:sku': 'Update product',
                'DELETE /api/products/:sku': 'Delete product'
            }
        });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ success: false, message: `Route not found` });
    });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`API Base: http://localhost:${PORT}/api`);
        console.log(`\nPress Ctrl+C to stop.\n`);
    });
}
