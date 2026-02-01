const readline = require('readline');
const ProductController = require('../controllers/ProductController');

// Parse input into command and args
function parseCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return { command: null };

    const firstSpaceIndex = trimmed.indexOf(' ');
    if (firstSpaceIndex === -1) {
        return { command: trimmed.toLowerCase(), rawArgs: '' };
    }

    const command = trimmed.slice(0, firstSpaceIndex).toLowerCase();
    const rest = trimmed.slice(firstSpaceIndex + 1).trim();
    return { command, rawArgs: rest };
}

// Format products list
function formatProducts(products) {
    if (!products || products.length === 0) return 'No products found';
    return products.map(p => `${p.sku}, ${p.name}, ${p.stock}`).join('\n');
}

// Format single product
function formatProduct(product) {
    return `${product.sku}, ${product.name}, ${product.stock}`;
}

// Process command and return result
function processCommand(input) {
    const { command, rawArgs } = parseCommand(input);
    if (!command) return true;

    switch (command) {
        case 'show': {
            if (!rawArgs) {
                console.log('Usage: show all | show <SKU>');
                return true;
            }

            if (rawArgs.toLowerCase() === 'all') {
                const result = ProductController.getAllProducts();
                console.log(result.success && result.data ? formatProducts(result.data) : result.message);
            } else {
                const result = ProductController.getProduct(rawArgs);
                console.log(result.success && result.data ? formatProduct(result.data) : result.message);
            }
            break;
        }

        case 'add': {
            if (!rawArgs) {
                console.log('Usage: add <SKU>,<Name>[,Stock]');
                return true;
            }

            const parts = rawArgs.split(',').map(p => p.trim());
            if (parts.length < 2) {
                console.log('Usage: add <SKU>,<Name>[,Stock]');
                return true;
            }

            const result = ProductController.addProduct(parts[0], parts[1], parts[2] ? parseInt(parts[2]) : 0);
            console.log(result.message);
            break;
        }

        case 'del': {
            if (!rawArgs) {
                console.log('Usage: del <SKU>');
                return true;
            }
            const result = ProductController.deleteProduct(rawArgs);
            console.log(result.message);
            break;
        }

        case 'mod': {
            if (!rawArgs) {
                console.log('Usage: mod <SKU> --stock <value>');
                return true;
            }

            const modParts = rawArgs.split(/\s+/);
            if (modParts.length < 3) {
                console.log('Usage: mod <SKU> --stock <value>');
                return true;
            }

            const sku = modParts[0];
            const flag = modParts[1];
            const value = modParts.slice(2).join(' ');
            const updates = {};

            if (flag === '--stock') {
                const stockValue = parseInt(value);
                if (isNaN(stockValue)) {
                    console.log('Stock must be a number');
                    return true;
                }
                updates.stock = stockValue;
            } else if (flag === '--name') {
                if (!value) {
                    console.log('Name cannot be empty');
                    return true;
                }
                updates.name = value;
            } else {
                console.log(`Unknown flag: ${flag}`);
                return true;
            }

            const result = ProductController.updateProduct(sku, updates);
            console.log(result.message);
            break;
        }

        case 'help': {
            console.log(`
Commands:
  show all                    Show all products (sku, name, stock)
  show <SKU>                  Show one product
  add <SKU>,<Name>[,Stock]    Add product (stock default: 0)
  del <SKU>                   Delete product
  mod <SKU> --stock <value>   Update stock
  help                        Show this menu
  exit                        Exit
            `);
            break;
        }

        case 'exit':
        case 'quit':
        case 'q': {
            console.log('Goodbye!');
            return false;
        }

        default: {
            console.log(`Unknown command: ${command}`);
            break;
        }
    }

    return true;
}

// Start interactive mode
function startInteractiveMode() {
    console.log('IMS CLI Mode - Type "help" for commands\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const prompt = () => process.stdout.write('> ');
    prompt();

    rl.on('line', (input) => {
        if (!processCommand(input)) {
            rl.close();
            process.exit(0);
        }
        prompt();
    });

    rl.on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
    });
}

module.exports = startInteractiveMode;
