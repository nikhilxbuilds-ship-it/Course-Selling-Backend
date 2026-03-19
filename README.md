# Course Selling Backend

A Node.js + Express + MongoDB backend for a course-selling platform where users can browse and purchase courses, and admins can create and manage courses.

---

##  Features

###  User
- Signup & Login (JWT Authentication)
- Browse available courses
- Purchase courses
- View purchased courses

### Admin
- Admin signup & login
- Create new courses
- Update course details
- Delete courses
- View all created courses

---

## Tech Stack

- Backend: Node.js, Express.js  
- Database: MongoDB (Mongoose)  
- Authentication: JWT  
- Validation: Zod  
- Password Hashing: bcrypt  

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/nikhilxbuilds-ship-it/Course-Selling-Backend.git
cd Course-Selling-Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_USER_SECRET=your_user_secret
JWT_ADMIN_SECRET=your_admin_secret
```

### 4. Run the server
```bash
npm start
```

---

## API Endpoints

### User Routes

- POST `/user/signup`
- POST `/user/login`
- GET `/user/courses`
- POST `/user/purchase`
- GET `/user/purchases`

---

### Admin Routes

- POST `/admin/signup`
- POST `/admin/login`
- POST `/admin/course`
- PUT `/admin/course/:courseId`
- DELETE `/admin/course/:courseId`
- GET `/admin/courses`

---

## Authentication

Protected routes require a JWT token in headers:

```
Authorization: Bearer <your_token>
```

---

## Notes

- Passwords are hashed using bcrypt  
- Input validation is handled using Zod  
- Role-based access for users and admins  

---

## Future Improvements

- Add payment integration (Stripe / Razorpay)
- Add rate limiting for security
- Add pagination for courses
- Centralized error handling
- Logging (Winston / Morgan)

---

## Author

Nikhil Kumar  
GitHub: https://github.com/nikhilxbuilds-ship-it

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
