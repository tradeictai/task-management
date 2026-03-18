# 🎯 Phase 1: Basic Setup - YOUR STARTING POINT

This is where you learn the fundamentals. **Your goal: Make your first API call work.**

---

## 📚 What You're Building

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Port 3000)                  │
│  Your React App → Shows login page or dashboard         │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Request
                     │ (axios with token)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (Port 5000)                    │
│  Express Server → Handles requests → Saves to MongoDB   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Files for Phase 1

### Frontend

- [frontend/src/pages/login.jsx](../frontend/src/pages/login.jsx) - Login form
- [frontend/src/services/authService.js](../frontend/src/services/authService.js) - API calls
- [frontend/src/hooks/useApi.js](../frontend/src/hooks/useApi.js) - Handle async state
- [frontend/src/context/AuthContext.jsx](../frontend/src/context/AuthContext.jsx) - Store logged-in user

### Backend

- [backend/src/index.js](../backend/src/index.js) - Server entry point
- [backend/src/routes/authRoutes.js](../backend/src/routes/authRoutes.js) - Login/register endpoints
- [backend/src/controllers/authController.js](../backend/src/controllers/authController.js) - Handle requests
- [backend/src/services/authService.js](../backend/src/services/authService.js) - Business logic
- [backend/src/models/User.js](../backend/src/models/User.js) - Database schema

---

## 🧠 The Request-Response Cycle (Important!)

### User clicks "Login" in browser

```
Frontend (React Component)
    ↓
values = { email: "user@example.com", password: "password123" }
    ↓
Call useApi hook (async wrapper)
    ↓
axios.post('/auth/login', values)
    ↓
REQUEST SENT TO BACKEND
```

### Backend receives the HTTP request

```
Express Server receives: POST /api/auth/login
    ↓
Route handler (authRoutes.js)
    ↓
Middleware: validate (check email/password provided)
    ↓
Controller: authController.login()
    ↓
Service: authService.login(email, password)
    ↓
Model: User.findOne({ email })
    ↓
Database: MongoDB searches for user
    ↓
SERVICE RETURNS: { user, token }
    ↓
Controller sends JSON response
    ↓
RESPONSE SENT TO FRONTEND
```

### Frontend receives response

```
Response: { success: true, data: { user, token }, message: "Login successful" }
    ↓
useApi hook sets data = { user, token }
    ↓
localStorage.setItem('token', token)
    ↓
AuthContext.login(user, token)
    ↓
Component re-renders with user data
    ↓
Redirect to /dashboard
```

---

## ✅ Phase 1 Checklist

### Backend

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Test `/api/health` endpoint works
- [ ] Can POST to `/api/auth/register`
- [ ] Can POST to `/api/auth/login`
- [ ] Can GET `/api/auth/me` (with token)

### Frontend

- [ ] Frontend running on port 3000
- [ ] Can see login page
- [ ] Can fill and submit form
- [ ] Token saves to localStorage
- [ ] Redirects to dashboard
- [ ] Can see "Welcome, [name]" message

---

## 🚀 How to Test Phase 1

### Test 1: Backend Health (Command Line)

```bash
curl http://localhost:5000/api/health
```

Should return:

```json
{ "success": true, "message": "Server is running" }
```

### Test 2: Register via Backend (Command Line)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Should return:

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": { "name": "Test User", "email": "test@example.com", "_id": "..." },
    "token": "eyJ0eXAiOiJKV1QiLC..."
  },
  "message": "User registered successfully"
}
```

### Test 3: Login via Frontend (Browser)

1. Go to `http://localhost:3000`
2. Click "Register"
3. Fill form with email, password, name
4. Submit
5. Should redirect to dashboard
6. Verify "Welcome, [name]" appears

### Test 4: Check Token in localStorage (Browser Dev Tools)

1. Open DevTools (F12)
2. Go to Application → Storage → localStorage
3. Should see `token` key with JWT value
4. Should see `user` key with JSON user object

---

## 🎯 Learning Objectives - Phase 1

After Phase 1, you should understand:

1. **Request-Response Cycle**
   - How the browser sends data to server
   - How server responds with JSON
   - How response is handled in frontend

2. **Path: Frontend → Backend**
   - Frontend has `services/` (API calls)
   - Services call `axios` with URL
   - Backend has `routes/` → `controllers/` → `services/`
   - Services talk to `models/` (database)

3. **Error Handling**
   - What happens if password is wrong?
   - What if email already exists?
   - How does user see error message?

4. **Token Flow**
   - Register creates token
   - Login creates token
   - Token stored in localStorage
   - Token sent in Authorization header (added by axios interceptor)
   - Backend reads token from header

5. **State Management**
   - AuthContext stores user + token
   - useAuth hook accesses context from any component
   - useApi hook handles loading/error/data

---

## 💡 Key Code Snippets to Understand

### Frontend: Making API Call

```javascript
// services/authService.js
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
};

// pages/login.jsx
const { execute: loginApi, loading, error } = useApi(authAPI.login);
const response = await loginApi(values.email, values.password);
```

### Backend: Handling Request

```javascript
// controllers/authController.js
login: asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  // ALWAYS respond with this format
  successResponse(res, { user, token }, 'Login successful');
}),

// services/authService.js
login: async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw createError.unauthorized('Invalid email or password');

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw createError.unauthorized('Invalid email or password');

  const token = generateToken(user._id);
  return { user: user.toJSON(), token };
}
```

---

## 🔐 Understanding JWT Tokens

**What is a JWT token?**
A token that proves the user is logged in. It's a string like:

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NWE4ZjQyMzQ1MjMxMjM0NTY3ODkwYWIifQ.7x...
```

**How it works:**

1. User logs in
2. Backend creates token with user ID inside it
3. Token sent to frontend
4. Frontend stores in localStorage
5. For every future request, frontend sends: `Authorization: Bearer <token>`
6. Backend reads token, verifies it, extracts user ID
7. If token invalid or expired, backend returns 401 error
8. Frontend redirects to login

**In this project:**

```javascript
// backend/src/utils/jwt.js
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Frontend sends token in every request
// backend/src/services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🎓 Study Plan for Phase 1

**Day 1: Setup & Understand Architecture**

- Read SETUP.md
- Read README.md
- Draw out the request flow on paper

**Day 2: Run Backend**

- Start backend
- Test endpoints with Postman/curl
- Add console.log in controller to see request/response

**Day 3: Run Frontend**

- Start frontend
- Test login form
- Check DevTools Network tab to see API calls

**Day 4: Debug & Understand**

- Try wrong password - see error
- Register new user - verify in MongoDB
- Check localStorage after login
- Clear localStorage - should redirect to login

**Day 5: Modify & Experiment**

- Add a new field to User schema
- Update register form to include it
- See it flow through entire system

---

## 🚨 Common Phase 1 Issues

### Issue: "Cannot POST /api/auth/login"

- Backend not running on port 5000
- Router not imported in index.js
- Fix: Check backend console for errors

### Issue: "CORS error"

- Frontend on `localhost:3000`, backend on `localhost:5000`
- Fix: Already configured in backend with `cors()` middleware

### Issue: "Cannot connect to MongoDB"

- MongoDB not running
- Fix: `brew services start mongodb-community` or use Docker

### Issue: "Invalid token"

- Token expired after 7 days
- or JWT_SECRET changed
- Fix: Login again to get new token

---

## 📖 Read These in Order

1. [SETUP.md](./SETUP.md) - Get project running
2. [README.md](./README.md) - Understand philosophy
3. [Phase 1 Checklist](#-phase-1-checklist) - Know what to build
4. Backend source code:
   - [backend/src/index.js](../backend/src/index.js)
   - [backend/src/routes/authRoutes.js](../backend/src/routes/authRoutes.js)
   - [backend/src/controllers/authController.js](../backend/src/controllers/authController.js)
   - [backend/src/services/authService.js](../backend/src/services/authService.js)
5. Frontend source code:
   - [frontend/src/services/api.js](../frontend/src/services/api.js)
   - [frontend/src/hooks/useApi.js](../frontend/src/hooks/useApi.js)
   - [frontend/src/pages/login.jsx](../frontend/src/pages/login.jsx)

---

## ✨ Phase 1 Success = You Understand

- ✅ How request travels from frontend to backend
- ✅ How middleware works (validate, authenticate)
- ✅ How services separate logic from HTTP
- ✅ How tokens prove user identity
- ✅ How frontend stores and sends tokens
- ✅ How errors flow back to frontend
- ✅ Why we have Context API (store logged-in user globally)
- ✅ Why we have custom hooks (reuse async logic)

**If you understand these 8 things, you're ready for Phase 2!**

---

Good luck! Phase 1 is the foundation for everything else. 🚀
