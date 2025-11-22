# Shared API Contract Document

This document defines the API contracts for all three microservices to ensure consistent integration.

## Common Response Format

All APIs follow a consistent response format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "count": 0  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Common Data Field Names

- `memberId` / `borrowerMemberId` - Member identifier
- `itemId` - Item identifier (preferred over `bookId`)
- `bookId` - Legacy item identifier (for backward compatibility)
- `status` - Loan status: `'active' | 'returned' | 'overdue'`
- `availability` - Item availability: `true | false`
- `owner` - Item owner (required field)
- `type` - Item type: `'book' | 'magazine' | 'journal' | 'dvd' | 'other'`

---

## Member A: Catalog Service (Port 3001)

### Base URL
```
http://localhost:3001
```

### Members API

#### POST /api/members
Add a new member.

**Request Body:**
```json
{
  "name": "John Doe",
  "studentId": "STU001",
  "email": "john@example.com"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "studentId": "STU001",
    "email": "john@example.com",
    "borrowedItems": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Member created successfully"
}
```

#### GET /api/members
List all members.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "studentId": "STU001",
      "email": "john@example.com",
      "borrowedItems": ["item1", "item2"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Items API

#### POST /api/items
Add a new item.

**Request Body:**
```json
{
  "title": "Introduction to TypeScript",
  "type": "book",  // Required: 'book' | 'magazine' | 'journal' | 'dvd' | 'other'
  "owner": "Library",  // Required
  "author": "John Smith",  // Optional
  "isbn": "978-0-123456-78-9"  // Optional
}
```

**Validation Rules:**
- `title`: Required, non-empty string
- `type`: Required, must be one of: 'book', 'magazine', 'journal', 'dvd', 'other'
- `owner`: Required, non-empty string

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Introduction to TypeScript",
    "type": "book",
    "availability": true,
    "owner": "Library",
    "author": "John Smith",
    "isbn": "978-0-123456-78-9",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item created successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Item must have an owner"
}
```

#### GET /api/items
List all items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Introduction to TypeScript",
      "type": "book",
      "availability": true,
      "owner": "Library",
      "author": "John Smith",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Member B: Circulation Service (Port 3002)

### Base URL
```
http://localhost:3002
```

### Loans API

#### POST /api/loans/borrow
Borrow an item.

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439012",  // or "bookId" for backward compatibility
  "borrowerMemberId": "507f1f77bcf86cd799439011",  // or "memberId" for backward compatibility
  "days": 14  // Optional, default: 14
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "itemId": "507f1f77bcf86cd799439012",
    "memberId": "507f1f77bcf86cd799439011",
    "borrowDate": "2024-01-01T00:00:00.000Z",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "status": "active",
    "isOverdue": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item borrowed successfully"
}
```

**Error Responses:**
- `400`: Item not available or already on loan
- `404`: Item or member not found

#### POST /api/loans/return
Return an item.

**Request Body:**
```json
{
  "itemId": "507f1f77bcf86cd799439012"  // or "bookId" for backward compatibility
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "itemId": "507f1f77bcf86cd799439012",
    "memberId": "507f1f77bcf86cd799439011",
    "borrowDate": "2024-01-01T00:00:00.000Z",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "returnDate": "2024-01-10T00:00:00.000Z",
    "status": "returned",
    "isOverdue": false
  },
  "message": "Item returned successfully"
}
```

#### GET /api/loans
List all loans (current + history).

**Query Parameters:**
- `status`: Filter by status ('active', 'returned', 'overdue')
- `memberId`: Filter by member
- `itemId`: Filter by item

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "itemId": "507f1f77bcf86cd799439012",
      "memberId": "507f1f77bcf86cd799439011",
      "borrowDate": "2024-01-01T00:00:00.000Z",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "returnDate": null,
      "status": "active",
      "isOverdue": false
    }
  ],
  "count": 1
}
```

---

## Member C: Reporting Service (Port 3003)

### Base URL
```
http://localhost:3003
```

### Dashboard API

#### GET /api/dashboard/overdue
Get items past due date.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "loan": {
        "_id": "507f1f77bcf86cd799439013",
        "itemId": "507f1f77bcf86cd799439012",
        "memberId": "507f1f77bcf86cd799439011",
        "borrowDate": "2024-01-01T00:00:00.000Z",
        "dueDate": "2024-01-15T00:00:00.000Z",
        "status": "overdue",
        "isOverdue": true
      },
      "bookTitle": "Introduction to TypeScript",
      "memberName": "John Doe"
    }
  ],
  "count": 1,
  "message": "1 item(s) are overdue"
}
```

#### GET /api/dashboard/stats
Get dashboard statistics (most borrowed items, borrow counts by member).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 100,
    "totalMembers": 50,
    "activeLoans": 25,
    "overdueLoans": 3,
    "availableBooks": 75,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/loans/history
Get full loan history.

**Query Parameters:**
- `memberId`: Filter by member
- `itemId`: Filter by item
- `startDate`: Filter from date (ISO format)
- `endDate`: Filter to date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "loan": {
        "_id": "507f1f77bcf86cd799439013",
        "itemId": "507f1f77bcf86cd799439012",
        "memberId": "507f1f77bcf86cd799439011",
        "borrowDate": "2024-01-01T00:00:00.000Z",
        "dueDate": "2024-01-15T00:00:00.000Z",
        "returnDate": "2024-01-10T00:00:00.000Z",
        "status": "returned"
      },
      "bookTitle": "Introduction to TypeScript",
      "memberName": "John Doe"
    }
  ],
  "count": 1
}
```

---

## HTTP Status Codes

- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST (resource created)
- `400 Bad Request`: Invalid request data or validation error
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Error Handling

All errors follow the standard error response format:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## Integration Notes

1. **Member B** uses **Member A's** endpoints:
   - `GET /api/items/:id` - Check item availability
   - `PUT /api/items/:id` - Update item availability
   - `GET /api/members/:id` - Get member details
   - `PUT /api/members/:id` - Update member borrowed items

2. **Member C** uses both **Member A** and **Member B's** endpoints:
   - From Member A: `GET /api/items`, `GET /api/members`
   - From Member B: `GET /api/loans`, `GET /api/loans/active`, `GET /api/loans/overdue`

3. **Backward Compatibility**: All services support both `itemId`/`bookId` and `borrowerMemberId`/`memberId` for smooth migration.

---

## Version History

- **v1.0** (2024-01-01): Initial API contract
  - Member A: Members and Items APIs
  - Member B: Borrow and Return APIs
  - Member C: Dashboard and Statistics APIs

