# Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or Atlas connection string)

### Installation

1. **Install dependencies:**
   ```bash
   cd library-system
   npm install
   ```

2. **Build shared package:**
   ```bash
   cd shared
   npm run build
   cd ..
   ```

3. **Start MongoDB** (if using local):
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   mongod
   ```

4. **Start all backend services:**
   ```bash
   npm run dev
   ```
   
   You should see:
   - ✅ Catalog Service running on port 3001
   - ✅ Circulation Service running on port 3002
   - ✅ Reporting Service running on port 3003

5. **Start frontend** (in a new terminal):
   ```bash
   npm run dev:frontend
   ```

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Catalog API: http://localhost:3001
   - Circulation API: http://localhost:3002
   - Reporting API: http://localhost:3003

## 📝 Quick Test Flow

### 1. Add a Member (Member A)
- Navigate to "Members" page
- Click "+ Add Member"
- Fill in: Name, Student ID, Email (optional)
- Submit

### 2. Add an Item (Member A)
- Navigate to "Items" page
- Click "+ Add Item"
- Fill in: Title, Type, Owner (required), Author, ISBN
- Submit

### 3. Borrow an Item (Member B)
- Navigate to "Loans" page
- Click "+ Borrow Item"
- Select available item and member
- Set loan period (default: 14 days)
- Submit

### 4. View Dashboard (Member C)
- Navigate to "Dashboard" or "Reports"
- View statistics, overdue items, and loan history

### 5. Return an Item (Member B)
- Navigate to "Loans" page
- Find the borrowed item in "Currently Borrowed" section
- Click "Return" button

## 🎯 Key Features

- **Member A**: Manage catalog (items) and member profiles
- **Member B**: Handle lending and returns
- **Member C**: Dashboard and reporting with statistics

## 📚 Documentation

- `API_CONTRACT.md` - Complete API specification
- `README.md` - Full setup guide
- `IMPLEMENTATION_SUMMARY.md` - Feature summary

## ⚠️ Troubleshooting

**MongoDB Connection Issues:**
- Check MongoDB is running: `mongosh` or `mongo`
- Verify connection string in `.env` files
- Check firewall settings

**TypeScript Errors:**
- Build shared package first: `cd shared && npm run build`
- Restart TypeScript server in your IDE

**Port Already in Use:**
- Change ports in `.env` files
- Or stop the process using the port

## 🎉 You're Ready!

The system is fully functional with all three members' requirements implemented!

