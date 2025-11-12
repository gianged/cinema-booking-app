# 🌐 API Endpoints Reference

Complete API documentation for the Cinema Booking App backend.

**Base URL:** `http://localhost:4000`

---

## 📑 Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Films](#films)
- [Categories](#categories)
- [Show Schedules](#show-schedules)
- [Tickets](#tickets)

---

## 🔐 Authentication

### Login

**Endpoint:** `POST /security/login`

**Access:** Public

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "u",
    "isActive": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200 OK` - Login successful
- `404 Not Found` - User not found or incorrect credentials
- `403 Forbidden` - Account is deactivated

### Register

**Endpoint:** `POST /security/register`

**Access:** Public

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": 2,
    "username": "new_user",
    "role": "u",
    "isActive": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `201 Created` - Registration successful
- `400 Bad Request` - Username already exists or validation error

---

## 👥 User Management

### Get All Users

**Endpoint:** `GET /security/user`

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "role": "a",
    "isActive": 1
  },
  {
    "id": 2,
    "username": "user",
    "role": "u",
    "isActive": 1
  }
]
```

### Get User by ID

**Endpoint:** `GET /security/user/:id`

**Access:** Admin only

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "role": "u",
  "isActive": 1
}
```

### Create User

**Endpoint:** `POST /security/user`

**Access:** Admin only

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "a" | "u",
  "isActive": 0 | 1
}
```

**Response:**
```json
{
  "id": 3,
  "username": "new_admin",
  "role": "a",
  "isActive": 1
}
```

### Update User

**Endpoint:** `PUT /security/user/:id`

**Access:** Admin only

**Request Body:**
```json
{
  "password": "string",
  "role": "a" | "u",
  "isActive": 0 | 1
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "affectedCount": 1
}
```

### Delete User

**Endpoint:** `DELETE /security/user/:id`

**Access:** Admin only

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedCount": 1
}
```

### Cleanup Inactive Users

**Endpoint:** `DELETE /security/user/cleanup`

**Access:** Admin only

**Response:**
```json
{
  "message": "Inactive users cleaned up successfully",
  "deletedCount": 5
}
```

---

## 🎬 Films

### Get Current Films

**Endpoint:** `GET /film/currentshow`

**Access:** Public

**Description:** Returns films that premiered within the last 14 days

**Response:**
```json
[
  {
    "id": 1,
    "filmName": "Inception",
    "filmDescription": "A thief who steals corporate secrets...",
    "poster": "<base64_string>",
    "backdrop": "<base64_string>",
    "premiere": "2024-01-15T00:00:00.000Z",
    "trailer": "https://youtube.com/...",
    "isActive": 1
  }
]
```

### Get Active Films

**Endpoint:** `GET /film/active`

**Access:** Public

**Description:** Returns all active films

### Get All Films

**Endpoint:** `GET /film`

**Access:** Admin only

**Description:** Returns all films including categories

### Get Film by ID

**Endpoint:** `GET /film/:id`

**Access:** Public

**Response:**
```json
{
  "id": 1,
  "filmName": "Inception",
  "filmDescription": "A thief who steals corporate secrets...",
  "poster": "<base64_string>",
  "backdrop": "<base64_string>",
  "premiere": "2024-01-15T00:00:00.000Z",
  "trailer": "https://youtube.com/...",
  "isActive": 1,
  "categories": "Action, Sci-Fi, Thriller"
}
```

### Create Film

**Endpoint:** `POST /film`

**Access:** Admin only

**Request Body:**
```json
{
  "filmName": "string",
  "filmDescription": "string",
  "poster": "data:image/jpeg;base64,...",
  "backdrop": "data:image/jpeg;base64,...",
  "premiere": "2024-01-15",
  "trailer": "https://youtube.com/...",
  "isActive": 1,
  "categories": [1, 2, 3]
}
```

### Update Film

**Endpoint:** `PUT /film/:id`

**Access:** Admin only

**Request Body:**
```json
{
  "filmName": "string",
  "filmDescription": "string",
  "premiere": "2024-01-15",
  "trailer": "https://youtube.com/...",
  "isActive": 1,
  "categories": [1, 2, 3]
}
```

### Delete Film

**Endpoint:** `DELETE /film/:id`

**Access:** Admin only

### Cleanup Inactive Films

**Endpoint:** `DELETE /film/cleanup`

**Access:** Admin only

---

## 🏷️ Categories

### Get Active Categories

**Endpoint:** `GET /category/active`

**Access:** Public

**Response:**
```json
[
  {
    "id": 1,
    "categoryName": "Action",
    "isActive": 1
  },
  {
    "id": 2,
    "categoryName": "Drama",
    "isActive": 1
  }
]
```

### Get All Categories

**Endpoint:** `GET /category`

**Access:** Admin only

### Get Category by ID

**Endpoint:** `GET /category/:id`

**Access:** Admin only

### Create Category

**Endpoint:** `POST /category`

**Access:** Admin only

**Request Body:**
```json
{
  "categoryName": "string",
  "isActive": 0 | 1
}
```

### Update Category

**Endpoint:** `PUT /category/:id`

**Access:** Admin only

### Delete Category

**Endpoint:** `DELETE /category/:id`

**Access:** Admin only

---

## 📅 Show Schedules

### Get Active Shows for Film

**Endpoint:** `GET /show/active/:id`

**Access:** Public

**Parameters:**
- `id` (path) - Film ID

**Response:**
```json
[
  {
    "id": 1,
    "film": "1",
    "showPrice": 150000,
    "showDay": "2024-01-20T00:00:00.000Z",
    "beginTime": "14:00:00",
    "endTime": "16:00:00",
    "room": "Room 1",
    "isActive": 1,
    "filmName": "Inception"
  }
]
```

### Get All Shows

**Endpoint:** `GET /show`

**Access:** Admin only

**Description:** Returns all upcoming shows

### Get Show by ID

**Endpoint:** `GET /show/:id`

**Access:** Public

### Create Show

**Endpoint:** `POST /show`

**Access:** Admin only

**Request Body:**
```json
{
  "film": 1,
  "showPrice": 150000,
  "showDay": "2024-01-20",
  "beginTime": "14:00",
  "room": "Room 1",
  "isActive": 1
}
```

**Note:** End time is automatically calculated as `beginTime + 2 hours`

### Update Show

**Endpoint:** `PUT /show/:id`

**Access:** Admin only

### Delete Show

**Endpoint:** `DELETE /show/:id`

**Access:** Admin only

---

## 🎫 Tickets

### Get User Tickets

**Endpoint:** `GET /ticket/userview/:id`

**Access:** Public

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
[
  {
    "idTicket": 1,
    "idUser": 1,
    "idShow": 1,
    "ticketAmount": 2,
    "totalPrice": 300000,
    "filmName": "Inception",
    "username": "john_doe",
    "showDay": "2024-01-20T00:00:00.000Z",
    "showTime": "14:00:00 - 16:00:00"
  }
]
```

### Get All Tickets

**Endpoint:** `GET /ticket`

**Access:** Admin only

### Get Ticket by ID

**Endpoint:** `GET /ticket/:id`

**Access:** Public

### Create Ticket (Book)

**Endpoint:** `POST /ticket`

**Access:** Public

**Request Body:**
```json
{
  "idUser": 1,
  "idShow": 1,
  "ticketAmount": 2,
  "totalPrice": 300000
}
```

### Update Ticket

**Endpoint:** `PUT /ticket/:id`

**Access:** Admin only

### Delete Ticket

**Endpoint:** `DELETE /ticket/:id`

**Access:** Admin only

---

## ⚠️ Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation error details"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An error occurred"
}
```

---

## 📊 Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* ... */ },
  "affectedCount": 1
}
```

### List Response
```json
[
  { /* item 1 */ },
  { /* item 2 */ }
]
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Error description"
}
```

---

## 🔑 Authentication Headers

For protected endpoints, include the JWT token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token is returned from `/security/login` or `/security/register`

---

**For type definitions, see [TYPES.md](./TYPES.md)**

**For authentication details, see [AUTHENTICATION.md](./AUTHENTICATION.md)**
