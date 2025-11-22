# Library Management System

A microservices-based library management system built with MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Architecture

The system is organized as a monorepo with three backend microservices and one frontend application:

### Backend Services

1. **Catalog Service** (Port 3001) - Member A
   - Manages library catalog (Books/Items)
   - Manages student profiles (Members)
   - Collections: `Items`, `Members`

2. **Circulation Service** (Port 3002) - Member B
   - Handles lending and return logic
   - Manages loan records
   - Updates book availability
   - Collections: `Loans`, interacts with `Items`

3. **Reporting Service** (Port 3003) - Member C
   - Provides dashboard and reporting functions
   - Displays overdue books
   - Generates statistics
   - Collections: `Loans`, `Dashboard`

### Frontend

- **React Application** (Port 5173)
  - Single frontend application
  - Uses Tailwind CSS for styling
  - Connects to all three backend services

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation

1. Clone the repository and navigate to the project:
```bash
cd library-system
```

2. Install dependencies for all workspaces:
```bash
npm install
```

3. Set up environment variables:

The `.env` files have been created for each backend service with default MongoDB connection strings. You can modify them if needed:

**backend/catalog-service/.env:**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/library-system
```

**backend/circulation-service/.env:**
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/library-system
CATALOG_SERVICE_URL=http://localhost:3001
```

**backend/reporting-service/.env:**
```
PORT=3003
MONGODB_URI=mongodb://localhost:27017/library-system
CATALOG_SERVICE_URL=http://localhost:3001
CIRCULATION_SERVICE_URL=http://localhost:3002
```

**MongoDB Connection Options:**
- **Local MongoDB**: `mongodb://localhost:27017/library-system` (default)
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/library-system`
- **Custom MongoDB**: Update the `MONGODB_URI` in each `.env` file with your connection string

**Note**: Make sure MongoDB is running before starting the services. For local MongoDB, ensure it's installed and running on port 27017.

## Running the Application

### Option 1: Run All Backend Services (Recommended)

From the root directory:
```bash
npm run dev
```

This will start all three backend services (catalog, circulation, and reporting) concurrently.

### Option 2: Run All Services (Backend + Frontend)

From the root directory:
```bash
npm run dev:all
```

This will start all three backend services and the frontend concurrently.

### Option 3: Run Services Individually

**Terminal 1 - Catalog Service:**
```bash
npm run dev:catalog
```

**Terminal 2 - Circulation Service:**
```bash
npm run dev:circulation
```

**Terminal 3 - Reporting Service:**
```bash
npm run dev:reporting
```

**Terminal 4 - Frontend:**
```bash
npm run dev:frontend
```

## Access the Application

- Frontend: http://localhost:5173
- Catalog Service: http://localhost:3001
- Circulation Service: http://localhost:3002
- Reporting Service: http://localhost:3003

## API Endpoints

### Catalog Service (Port 3001)

**Books:**
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `GET /api/books/available` - Get available books
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

**Members:**
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `GET /api/members/student/:studentId` - Get member by student ID
- `POST /api/members` - Create a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### Circulation Service (Port 3002)

**Loans:**
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get loan by ID
- `GET /api/loans/active` - Get active loans
- `GET /api/loans/overdue` - Get overdue loans
- `GET /api/loans/member/:memberId` - Get loans by member
- `GET /api/loans/book/:bookId` - Get loans by book
- `POST /api/loans` - Create a new loan
- `GET /api/books/:bookId/availability` - Check book availability

**Returns:**
- `POST /api/returns/loan/:loanId` - Return book by loan ID
- `POST /api/returns/book/:bookId` - Return book by book ID
- `POST /api/returns/update-overdue` - Update overdue items

### Reporting Service (Port 3003)

**Dashboard:**
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/dashboard/stored` - Get stored dashboard data

**Statistics:**
- `GET /api/statistics/most-borrowed?limit=10` - Get most borrowed books
- `GET /api/statistics/borrowing-history?memberId=&bookId=` - Get borrowing history
- `GET /api/statistics/overdue` - Get overdue books
- `GET /api/statistics/member-stats?limit=10` - Get member borrowing statistics

## Project Structure

```
library-system/
├── backend/
│   ├── catalog-service/      # Member A - Catalog & Members
│   ├── circulation-service/   # Member B - Loans & Returns
│   └── reporting-service/     # Member C - Dashboard & Reports
├── frontend/                  # React + Tailwind CSS
├── shared/                    # Shared types and utilities
└── package.json              # Root monorepo config
```

## Features

- **Book Management**: Add, update, delete, and view books
- **Member Management**: Register students with their details
- **Loan Management**: Create loans, track returns, manage overdue items
- **Dashboard**: Real-time statistics and overview
- **Reports**: Most borrowed books, overdue items, borrowing history, member statistics

## Technologies Used

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose)
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router
- **Architecture**: Microservices, Monorepo (npm workspaces)
- **Integration**: RESTful API-based integration between services

## Service Integration

All backend services are integrated using **RESTful API calls**:

- **Circulation Service** communicates with **Catalog Service** via HTTP APIs to:
  - Check book availability
  - Update book status when loans are created/returned
  - Update member borrowed items

- **Reporting Service** communicates with both **Catalog** and **Circulation Services** via HTTP APIs to:
  - Fetch books and members for dashboard statistics
  - Fetch loans for reporting and analytics
  - Combine data from multiple services for comprehensive reports

Each service includes:
- **Health check endpoints** (`/health`) for monitoring
- **Dependency health checks** (`/health/dependencies`) to verify dependent services
- **Centralized API client** with timeout, logging, and error handling
- **Comprehensive error handling** with rollback logic

See `backend/INTEGRATION.md` for detailed integration documentation.

## Development

Each service can be developed independently. The shared package contains common types and utilities used across services.

## Notes

- All services share the same MongoDB database but use different collections
- Services communicate via HTTP REST APIs
- The frontend uses Vite proxy configuration to route API calls to the appropriate backend service

