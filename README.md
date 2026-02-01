# Inventory Management System (IMS)

Simple inventory system built with Node.js using MVC-R pattern.
Support API and CLI mode.

## Setup

```bash
npm install
```

## Usage

**CLI Mode:**
```bash
npm run dev:cli
```

**API Web Server Mode:**
```bash
npm run dev
```

## CLI Commands

```
show all                    Show all products
show <SKU>                  Show one product
add <SKU>,<Name>[,Stock]    Add product (stock default: 0)
del <SKU>                   Delete product
mod <SKU> --stock <value>   Update stock
help                        Show menu
exit                        Exit
```

## Project Structure

```
IMS/
├── index.js              # Entry point
├── inventory.db          # SQLite database
└── src/
    ├── database.js       # DB connection
    ├── models/
    │   └── Product.js    # Model for product
    ├── controllers/
    │   └── ProductController.js  # Controller for product
    └── routes/
        ├── apiRouter.js  # Web API routes
        └── cliRouter.js  # CLI commands
```
