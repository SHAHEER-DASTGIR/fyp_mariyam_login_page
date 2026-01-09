# Setup Guide for LearnHub Application

## Overview
Your application now has a complete authentication system connected to MongoDB. When students sign up or log in, their credentials are saved in the MongoDB database and they are automatically redirected to the student dashboard with the overview page.

## Prerequisites
Before running the application, ensure you have:
1. Node.js installed (v16 or higher)
2. MongoDB installed and running locally, or a MongoDB Atlas connection string

## Backend Setup

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Open `backend/.env` and update if needed:
```env
MONGODB_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

**Important Notes:**
- If using MongoDB Atlas, replace the MONGODB_URI with your connection string
- Change JWT_SECRET to a secure random string in production
- Make sure MongoDB is running on your system

### 4. Start MongoDB (if running locally)
```bash
mongod
```

### 5. Start the backend server
```bash
npm start
```

You should see:
```
✅ SERVER IS RUNNING!
🚀 Open browser: http://localhost:5000
✅ MongoDB connected successfully!
```

## Frontend Setup

### 1. Navigate to the frontend directory (in a new terminal)
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

## Testing the Application

### 1. Sign Up Flow
1. Open `http://localhost:5173` in your browser
2. Click "Join for Free" or navigate to signup
3. Select your role (Student, Instructor, or Admin)
4. Fill in:
   - Full Name
   - Email
   - Password (minimum 6 characters)
5. Click "Create Account"
6. You will be automatically redirected to the appropriate dashboard

### 2. Login Flow
1. Go to the login page
2. Enter your email and password
3. Click "Login"
4. You will be redirected to your dashboard based on your role

### 3. Student Dashboard Features
After logging in as a student, you'll see:
- **Left Sidebar** (Fixed across all pages):
  - Overview
  - Courses
  - Performance
  - Notes

- **Top Navbar** (Fixed across all pages):
  - Page title
  - Notification bell with badge
  - Profile dropdown with user info and logout

- **Overview Page** includes:
  - Welcome message with student name
  - Three stat cards (Attended Lecture, Unattended Lecture, Course Completed)
  - Hours Spent bar chart
  - Performance gauge (circular progress)
  - Leaderboard table
  - Right panel with:
    - User profile card
    - Calendar
    - To-Do List
    - Report Analysis

## Database Verification

To verify that data is being saved to MongoDB:

### Using MongoDB Shell:
```bash
mongosh
use learnhub
db.users.find().pretty()
```

### Using MongoDB Compass:
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to the `learnhub` database
4. Click on the `users` collection
5. You should see all registered users

## Troubleshooting

### Backend Issues

**Issue:** MongoDB connection error
```
Solution: Make sure MongoDB is running:
- Local: Start mongod service
- Atlas: Check your connection string and network access
```

**Issue:** Port 5000 already in use
```
Solution: Change the PORT in backend/.env to another port (e.g., 5001)
```

**Issue:** JWT_SECRET not found
```
Solution: Make sure backend/.env file exists and contains JWT_SECRET
```

### Frontend Issues

**Issue:** Cannot connect to backend
```
Solution:
1. Make sure backend is running on http://localhost:5000
2. Check that CORS is enabled in backend/server.js
3. Verify the API URL in signup/login pages (http://localhost:5000/api/auth/...)
```

**Issue:** Charts not displaying
```
Solution: Make sure recharts and react-is packages are installed:
npm install recharts react-is
```

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   └── user.js           # User schema with password hashing
│   ├── routes/
│   │   └── auth.js           # Login and signup routes
│   ├── server.js             # Express server with MongoDB connection
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── HoursChart.tsx
│   │   │   ├── PerformanceGauge.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx           # Login page (MongoDB connected)
│   │   │   ├── Signup.tsx          # Signup page (MongoDB connected)
│   │   │   ├── StudentDashboard.tsx # Main dashboard with sidebar & navbar
│   │   │   ├── Overview.tsx         # Overview page content
│   │   │   ├── Landing.tsx
│   │   │   └── ... other pages
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
```

## API Endpoints

### POST /api/auth/signup
Register a new user
```json
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}

Response:
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### POST /api/auth/login
Login existing user
```json
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

## Features Implemented

### Authentication
- MongoDB-connected signup with password hashing (bcrypt)
- MongoDB-connected login with password validation
- JWT token generation
- Role-based authentication (Student, Instructor, Admin)
- Automatic dashboard routing based on user role

### Student Dashboard
- Fixed left sidebar with navigation
- Fixed top navbar with profile dropdown
- Overview page with:
  - Welcome message
  - Statistics cards
  - Interactive charts (Hours Spent, Performance Gauge)
  - Leaderboard
  - Calendar
  - To-Do List
- Courses page
- Performance page
- Notes page
- Profile management
- Logout functionality

## Next Steps

1. Add more features to the dashboard pages
2. Implement course enrollment functionality
3. Add instructor and admin dashboard features
4. Implement real data for charts and statistics
5. Add profile editing functionality
6. Implement notifications system
7. Add course detail pages
8. Implement assignment submission
9. Add grade tracking
10. Implement messaging system

## Important Security Notes

1. **Change JWT_SECRET** in production to a secure random string
2. **Never commit** .env files to version control
3. **Use HTTPS** in production
4. **Implement rate limiting** for API endpoints
5. **Add input validation** on all forms
6. **Implement CSRF protection**
7. **Use MongoDB Atlas** with proper security groups in production

## Support

If you encounter any issues:
1. Check that MongoDB is running
2. Verify all dependencies are installed
3. Check the browser console for frontend errors
4. Check the backend terminal for server errors
5. Ensure environment variables are properly configured
