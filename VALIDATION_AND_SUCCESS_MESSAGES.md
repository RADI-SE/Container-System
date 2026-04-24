# All Success Messages & Validations

## 🟦 CONTAINER CONTROLLER

### ✅ Create Container
**Endpoint:** `POST /api/containers/create`


**Success Message:**
```json
{
  "success": true,
  "message": "Container created successfully",
  "validationPassed": true,
  "validationMessages": [
    "✓ All required fields validated",
    "✓ Container uniqueness validated",
    "✓ Document format validated"
  ],
  "data": { container object }
}
```

**Error Messages:**
- `"Container Name is required"`
- `"Container Number is required"`
- `"Bill of Lading is required"`
- `"Purchase Order is required"`
- `"Invoice Number is required"`
- `"Receiving Branch is required"`
- `"Region is required"`
- `"Container Number or Bill of Lading already exists"`
- `"Server error while creating container"`

---

### ✅ Get Containers
**Endpoint:** `GET /api/containers`

**Success Message:**
```json
{
  "success": true,
  "count": 5,
  "data": [ containers array ]
}
```

---

### ✅ Get Container by ID
**Endpoint:** `GET /api/containers/:id`

**Success Message:**
```json
{
  "success": true,
  "data": { container object }
}
```

**Error Messages:**
- `"Container not found"` (404)
- `"Unauthorized"` (403)
- `"Server error fetching container"` (500)

---

### ✅ Share Container
**Endpoint:** `POST /api/containers/share`

**Success Message:**
```json
{
  "success": true,
  "message": "Access shared successfully"
}
```

**Error Messages:**
- `"Container not found"` (404)
- `"Unauthorized: You do not own this container"` (403)
- `"Server error"` (500)

---

### ✅ Unshare Container
**Endpoint:** `DELETE /api/containers/unshare`

**Success Message:**
```json
{
  "success": true,
  "message": "User access removed"
}
```

**Error Messages:**
- `"containerId and userIdToRemove are required"` (400)
- `"Container not found"` (404)
- `"Not authorized"` (403)
- `"Server error removing access"` (500)

---

### ✅ Get Available Containers for User
**Endpoint:** `GET /api/containers/available/:userId`

**Success Message:**
```json
{
  "success": true,
  "count": 10,
  "data": [ containers array ]
}
```

**Error Messages:**
- `"Failed to fetch available containers"` (500)

---

### ✅ Update Container
**Endpoint:** `PUT /api/containers/:id`

**Validations:**
- ✓ All required fields validated
- ✓ Document updates validated

**Success Message:**
```json
{
  "success": true,
  "message": "Container updated successfully",
  "data": { updated container object }
}
```

**Error Messages:**
- `"Container Name is required"`
- `"Container Number is required"`
- `"Bill of Lading is required"`
- `"Purchase Order is required"`
- `"Invoice Number is required"`
- `"Receiving Branch is required"`
- `"Region is required"`
- `"Container not found"` (404)
- `"Unauthorized"` (403)
- `"Server error while updating container"` (500)

---

### ✅ Delete Container
**Endpoint:** `DELETE /api/containers/:id`

**Success Message:**
```json
{
  "success": true,
  "message": "Container deleted successfully"
}
```

**Error Messages:**
- `"Container not found"` (404)
- `"Unauthorized: Only the owner can delete this"` (403)
- `"Error deleting container"` (500)

---

## 📦 INVENTORY CONTROLLER (Container Embedded)

### ✅ Add Inventory Item
**Endpoint:** `POST /api/containers/:containerId/inventory`

**Success Message:**
```json
{
  "success": true,
  "message": "Item added to manifest successfully",
  "data": { new inventory item }
}
```

**Error Messages:**
- `"Container not found"` (404)
- `"Unauthorized: You do not have permission to add items to this container"` (403)
- `"Server error while adding item"` (500)

---

### ✅ Update Inventory Item
**Endpoint:** `PUT /api/containers/:containerId/inventory/:itemId`

**Success Message:**
```json
{
  "success": true,
  "message": "Inventory row updated successfully",
  "data": [ updated inventory array ]
}
```

**Error Messages:**
- `"Container or Item not found"` (404)
- `"Error updating inventory row"` (500)

---

### ✅ Delete Inventory Item
**Endpoint:** `DELETE /api/containers/:containerId/inventory/:itemId`

**Success Message:**
```json
{
  "success": true,
  "message": "Row removed from table"
}
```

**Error Messages:**
- `"Not found"` (404)
- `"Server error"` (500)

---

### ✅ Get User Containers
**Endpoint:** `GET /api/containers/user/:userId`

**Success Message:**
```json
{
  "success": true,
  "count": 5,
  "data": [ containers array ]
}
```

**Error Messages:**
- `"Failed to fetch available containers"` (500)

---

### ✅ Get User Inventory Table Data
**Endpoint:** `GET /api/inventory/:userId`

**Success Message:**
```json
{
  "success": true,
  "count": 15,
  "data": [ flattened inventory items ]
}
```

**Error Messages:**
- `"Failed to fetch inventory table data"` (500)

---

## 🔐 AUTH CONTROLLER

### ✅ Signup
**Endpoint:** `POST /api/auth/signup`

**Validations:**
- ✓ Name, email, password required
- ✓ Email uniqueness check

**Success Messages:**
```json
{
  "success": true,
  "message": "User created successfully. Check your email.",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "staff"
  }
}
```

**Alternative (if email fails):**
```json
{
  "success": true,
  "message": "User created, but verification email failed to send.",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

**Error Messages:**
- `"All fields are required"` (400)
- `"User already exists"` (400)
- `"Server error"` (500)

---

### ✅ Signin (Login)
**Endpoint:** `POST /api/auth/signin`

**Validations:**
- ✓ Email exists in database
- ✓ Password matches hash

**Success Message:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin|staff"
  }
}
```

**Error Messages:**
- `"Invalid credentials"` (400) - email not found or password mismatch
- `"Server error"` (500)

---

### ✅ Logout
**Endpoint:** `POST /api/auth/logout`

**Success Message:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### ✅ Check Auth
**Endpoint:** `GET /api/auth/check`

**Success Message:**
```json
{
  "success": true,
  "user": { user object without password }
}
```

**Error Messages:**
- `"User not found"` (400)
- `"Server error"` (500)

---

### ✅ Get All Users
**Endpoint:** `GET /api/auth/users`

**Success Message:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "admin|staff"
    }
  ]
}
```

**Error Messages:**
- `"Error fetching users"` (500)

---

## 📊 Summary by Status Code

### 201 (Created)
- Container created successfully
- User created successfully
- Item added to manifest successfully

### 200 (OK)
- All other successful operations
- Login, Logout, Updates, Deletes, Fetches

### 400 (Bad Request)
- Missing required fields
- Invalid credentials
- Duplicate records
- Validation failures

### 403 (Forbidden)
- Unauthorized access
- Only owner can delete
- Permission denied

### 404 (Not Found)
- Container not found
- Item not found
- User not found

### 500 (Server Error)
- Server errors
- Database errors
- Email sending failures
