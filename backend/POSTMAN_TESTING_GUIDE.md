# Django Backend API Testing Guide

## 🚀 Setup Instructions

### 1. Start Django Development Server

```bash
# Navigate to Django backend directory
cd C:\Users\ASUS\OneDrive\Desktop\pto\Esewa-JobApplication\backend\HirelyBackend

# Start the server
python manage.py runserver
```

**Expected Output:**
```
System check identified no issues (0 silenced).
Django version 5.2.7, using settings 'HirelyBackend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

---

## 📋 API Endpoints for Postman Testing

### Base URL: `http://127.0.0.1:8000`

---

## 🧪 Test Scenarios

### 1. Health Check (Public Endpoint)

**GET** `http://127.0.0.1:8000/interviews/`

**Expected Response:**
```json
{
    "success": true,
    "message": "Interview API is working!",
    "timestamp": 0
}
```

---

### 2. User Authentication (Required for Interview APIs)

Since the interview APIs require authentication, you need to test with the existing authentication system.

#### Option A: Get Authentication Token

**POST** `http://127.0.0.1:8000/accounts/login/` (or similar login endpoint)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "username": "your_username",
    "password": "your_password"
}
```

#### Option B: Create Test User (if needed)

**POST** `http://127.0.0.1:8000/accounts/register/` (or similar register endpoint)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "user_type": "candidate"
}
```

---

### 3. Generate Interview Questions

**POST** `http://127.0.0.1:8000/interviews/generate/`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**
```json
{
    "role": "Frontend Developer",
    "type": "Technical",
    "level": "Mid",
    "techstack": ["React", "TypeScript", "Next.js"],
    "amount": 5
}
```

**Expected Response:**
```json
{
    "success": true,
    "data": {
        "interview_id": "uuid-here",
        "interview": {
            "id": "uuid-here",
            "user": 1,
            "user_email": "test@example.com",
            "role": "Frontend Developer",
            "type": "Technical",
            "level": "Mid",
            "techstack": ["React", "TypeScript", "Next.js"],
            "questions": [
                "What is your experience with Frontend Developer development?",
                "How would you implement a scalable solution using React, TypeScript, Next.js?",
                "Explain the architecture you would use for a Frontend Developer project.",
                "What are the best practices for React, TypeScript, Next.js development?",
                "How do you handle performance optimization in Frontend Developer applications?"
            ],
            "cover_image": "/covers/google.png",
            "finalized": true,
            "question_count": 5,
            "created_at": "2025-11-03T...",
            "updated_at": "2025-11-03T..."
        },
        "questions_generated": 5
    }
}
```

---

### 4. List User's Interviews

**GET** `http://127.0.0.1:8000/interviews/list/`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response:**
```json
[
    {
        "id": "uuid-here",
        "user": 1,
        "user_email": "test@example.com",
        "role": "Frontend Developer",
        "type": "Technical",
        "level": "Mid",
        "techstack": ["React", "TypeScript", "Next.js"],
        "questions": [...],
        "cover_image": "/covers/google.png",
        "finalized": true,
        "question_count": 5,
        "created_at": "2025-11-03T...",
        "updated_at": "2025-11-03T..."
    }
]
```

---

### 5. Get Specific Interview

**GET** `http://127.0.0.1:8000/interviews/{interview_id}/`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Replace `{interview_id}` with actual UUID from previous responses.

---

## 🔍 Testing Different Interview Types

### Technical Interview
```json
{
    "role": "Backend Developer",
    "type": "Technical",
    "level": "Senior",
    "techstack": ["Python", "Django", "PostgreSQL"],
    "amount": 7
}
```

### Behavioral Interview
```json
{
    "role": "Product Manager",
    "type": "Behavioral",
    "level": "Mid",
    "techstack": [],
    "amount": 6
}
```

### Mixed Interview
```json
{
    "role": "Full Stack Developer",
    "type": "Mixed",
    "level": "Entry",
    "techstack": ["JavaScript", "Node.js", "React"],
    "amount": 8
}
```

---

## 🛠 Troubleshooting

### Common Issues:

1. **Server not starting:**
   ```bash
   # Make sure you're in the right directory
   cd C:\Users\ASUS\OneDrive\Desktop\pto\Esewa-JobApplication\backend\HirelyBackend
   
   # Check if virtual environment is activated
   # Activate if needed: myenv\Scripts\activate
   
   # Run server
   python manage.py runserver
   ```

2. **Authentication errors:**
   - Make sure you have a valid JWT token
   - Check if user exists in the database
   - Verify the Authorization header format: `Bearer YOUR_TOKEN`

3. **404 Not Found:**
   - Check if URLs are correct
   - Ensure Django server is running on port 8000

4. **500 Internal Server Error:**
   - Check Django server console for error details
   - Verify database is migrated: `python manage.py migrate`

---

## 📝 Expected Validation Errors

### Missing Required Fields:
```json
{
    "success": false,
    "error": "Invalid data provided",
    "details": {
        "role": ["This field is required."],
        "type": ["This field is required."]
    }
}
```

### Invalid Interview Type:
```json
{
    "success": false,
    "error": "Invalid data provided",
    "details": {
        "type": ["\"InvalidType\" is not a valid choice."]
    }
}
```

---

## 🎯 Testing Checklist

- [ ] Django server is running (http://127.0.0.1:8000)
- [ ] Health check endpoint works
- [ ] User authentication is working
- [ ] Can generate technical interview
- [ ] Can generate behavioral interview
- [ ] Can generate mixed interview
- [ ] Can list user's interviews
- [ ] Can retrieve specific interview
- [ ] Error handling works for invalid data
- [ ] Authentication is properly enforced

---

## 🔧 Alternative Testing (If Authentication Issues)

If you have trouble with authentication, you can temporarily disable it for testing:

1. Open `interviews/views.py`
2. Comment out `@permission_classes([IsAuthenticated])` decorators
3. Set a default user in the views

**Note:** Remember to re-enable authentication after testing!

---

## 📊 Sample Postman Collection

You can import this into Postman:

```json
{
    "info": {
        "name": "Hirely Interview API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Health Check",
            "request": {
                "method": "GET",
                "header": [],
                "url": "http://127.0.0.1:8000/interviews/"
            }
        },
        {
            "name": "Generate Interview",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    },
                    {
                        "key": "Authorization",
                        "value": "Bearer {{token}}"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"role\": \"Frontend Developer\",\n    \"type\": \"Technical\",\n    \"level\": \"Mid\",\n    \"techstack\": [\"React\", \"TypeScript\", \"Next.js\"],\n    \"amount\": 5\n}"
                },
                "url": "http://127.0.0.1:8000/interviews/generate/"
            }
        }
    ]
}
```

Happy testing! 🎉