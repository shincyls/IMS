# Inventory Management System (IMS)

Simple inventory system built with Node.js using MVC-R pattern.
Support API and CLI mode.

## Tech Stack

### Backend: Node.js 
- **High Performance**: Fast execution suitable for real-time inventory updates.
- **Future-Proof**: The API-based server design allows seamless integration with future Web and Mobile applications.

### Database: sqlite3 (better-sqlite3)
- **Relational Structure**: Ideal for structured inventory data where data integrity is critical.
- **Reliable**: ACID compliance ensures accurate stock tracking (prevents data conflicts).
- **Embedded**: Fast and simple setup without needing a separate database server.

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
