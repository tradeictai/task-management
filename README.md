# Task Management System - Full Stack Learning Project

This is a **complete learning project** designed to teach you production-level full-stack development with **Node.js + Express + MongoDB** backend and **React + Next.js** frontend.

## 📚 Project Philosophy

This project is structured to teach **fundamental concepts** you'll use in any modern web application:

### Backend Fundamentals You'll Learn

- **Middleware Pipeline**: Request → Response lifecycle
- **Layered Architecture**: Routes → Controllers → Services → Models
- **Error Handling**: Consistent, predictable error handling across API
- **Authentication**: JWT tokens, secure token storage, middleware protection
- **Database Design**: Schema design, indexing, relationships
- **API Standards**: Consistent response format for all endpoints

### Frontend Fundamentals You'll Learn

- **API Integration**: Axios, interceptors, error handling
- **State Management**: Context API + useReducer pattern
- **Custom Hooks**: Extracting logic for reusability
- **Real-Time UI Sync**: Optimistic updates and rollbacks (Phase 5)
- **Loading & Error States**: Proper UX patterns
- **Authentication Flow**: Token storage, protected routes

---

## 🏗️ Project Architecture

### Backend Structure

```
backend/src/
├── config/           # Database connections
├── middleware/       # Auth, validation, error handling
├── models/          # MongoDB schemas (User, Project, Task)
├── services/        # Business logic (reusable, testable)
├── controllers/     # HTTP request handlers
├── routes/          # API endpoint definitions
├── utils/           # Helpers (JWT, password, errors)
└── index.js         # Express server entry point
```

**Key Principle**: Services are **independent of HTTP** - they can be tested without a server!

### Frontend Structure

```
frontend/src/
├── app/            # Next.js app directory
├── pages/          # Page components
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── context/        # Global state (auth)
├── services/       # API calls
└── utils/          # Helpers
```

**Key Principle**: All API calls go through `services/` layer, never directly in components!

---

## 📋 Learning Phases

### Phase 1: Basic Setup

**Goal**: First API call working

- ✅ Backend server running
- ✅ Frontend app running
- ✅ Health check endpoint tested
- **What you'll learn**: Project structure, how frontend talks to backend

### Phase 2: Auth System (JWT)

**Goal**: Register, Login, Protected routes

- Build register endpoint
- Build login endpoint
- Implement JWT middleware
- Store token in localStorage
- Test protected routes
- **What you'll learn**: Middleware, token flow, secure communication

### Phase 3: Projects CRUD

**Goal**: Full CRUD operations

- Create projects
- Get user's projects
- Update/delete projects
- **What you'll learn**: Controller-Service pattern, data ownership

### Phase 4: Tasks System

**Goal**: Relationships between data

- Add tasks to projects
- Update/complete tasks
- Filter by status
- **What you'll learn**: Database relationships, query optimization

### Phase 5: UI Sync (CRITICAL)

**Goal**: Professional UX patterns

- Optimistic updates (UI updates before server confirms)
- Error rollback (revert on failure)
- Loading states
- Multiple concurrent operations
- **What you'll learn**: Real-world UX complexity

### Phase 6: Comments (Optional)

**Goal**: Nested data structures

- Add comments to tasks
- Display comment threads
- **What you'll learn**: Deep nesting, API design depth

### Phase 7: Polish

**Goal**: Production readiness

- Pagination
- Search
- Better error messages
- Loading optimizations

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **Redis** (local or remote)
- **npm** or **yarn**

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your values
# MONGODB_URI=mongodb://localhost:27017/task-management
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=your_secret_key

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

Test: `curl http://localhost:5000/api/health`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔄 How Backend & Frontend Communicate

### Backend Response Format (ALWAYS)

```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful"
}
```

### Frontend Makes Request

```javascript
// services/authService.js
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data.data; // Extract actual data
  },
};
```

### Frontend Uses Hook

```javascript
const { execute: loginApi, loading, error } = useApi(authAPI.login);

const response = await loginApi("user@email.com", "password");
```

---

## 🎯 Key Concepts to Master

### 1. Middleware Execution Order

Request → Auth Middleware → Validation → Controller → Service → Response

```javascript
// Each middleware does ONE thing
authenticate(req, res, next)    // Check token
→ validate(req, res, next)       // Check data format
→ controller(req, res)           // Call service
```

### 2. Service = Business Logic

```javascript
// Services NEVER return HTTP responses
// They throw errors or return data
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found"); // Throw, not respond
  return { user, token };
};
```

### 3. Controller = HTTP Handler

```javascript
// Controllers ALWAYS handle responses
const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json({ success: true, data: result }); // Always respond
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

### 4. useApi Hook = Abstraction

```javascript
// Instead of This:
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
try {
  setLoading(true);
  const res = await api.get(...);
  setData(res.data);
} catch (e) {
  setError(e.message);
} finally {
  setLoading(false);
}

// Use This:
const { data, loading, error, execute } = useApi(fetchFunction);
await execute(args);
```

---

## 🐛 Common Mistakes to Avoid

### ❌ Backend Mistakes

1. **Mixing HTTP and Business Logic**

   ```javascript
   // BAD: DB query in controller
   const loginController = (req, res) => {
     const user = await User.findOne(...);
     res.json(user);
   };

   // GOOD: Delegate to service
   const loginController = async (req, res) => {
     const user = await authService.getUserById(...);
     res.json(user);
   };
   ```

2. **No Error Handling**

   ```javascript
   // BAD: Crashes if no user
   const user = await User.findById(id);
   res.json(user);

   // GOOD: Always check
   const user = await User.findById(id);
   if (!user) throw createError.notFound("User not found");
   res.json(user);
   ```

3. **Inconsistent Response Format**

   ```javascript
   // BAD: Different formats for different endpoints
   res.json({ user: userData });
   res.json(userData);
   res.send("Success");

   // GOOD: Always use wrapper
   successResponse(res, userData, "User fetched successfully");
   ```

### ❌ Frontend Mistakes

1. **API Calls in Components Without Abstraction**

   ```javascript
   // BAD: API logic scattered
   const LoginComponent = () => {
     const handleLogin = async () => {
       const res = await axios.post('http://localhost:5000/auth/login', ...);
       setUser(res.data.user);
     };
   };

   // GOOD: Centralized API
   export const authAPI = { login: (...) => {...} };
   const handleLogin = async () => {
     const {user} = await authAPI.login(...);
     setUser(user);
   };
   ```

2. **No Loading/Error States**

   ```javascript
   // BAD: User doesn't know what's happening
   <button onClick={handleSubmit}>Login</button>

   // GOOD: Feedback to user
   <button onClick={handleSubmit} disabled={loading}>
     {loading ? 'Logging in...' : 'Login'}
   </button>
   {error && <p className="error">{error}</p>}
   ```

3. **Not Storing Token Safely**

   ```javascript
   // BAD: Direct global variable
   window.token = jwtToken;

   // GOOD: localStorage + context
   localStorage.setItem("token", jwtToken);
   // Restore on app load
   useEffect(() => {
     const token = localStorage.getItem("token");
     setAuthContext(token);
   }, []);
   ```

---

## 📝 API Documentation (Phase 1-4)

### Auth Endpoints

```
POST   /api/auth/register         → Register new user
POST   /api/auth/login            → Login user
GET    /api/auth/me               → Get current user (protected)
```

### Project Endpoints

```
POST   /api/projects              → Create project (protected)
GET    /api/projects              → Get all user projects (protected)
GET    /api/projects/:id          → Get single project (protected)
PATCH  /api/projects/:id          → Update project (protected)
DELETE /api/projects/:id          → Delete project (protected)
```

### Task Endpoints

```
POST   /api/projects/:projectId/tasks                  → Create task
GET    /api/projects/:projectId/tasks                  → Get all tasks
GET    /api/projects/:projectId/tasks/status/:status   → Filter by status
GET    /api/tasks/:id                                  → Get single task
PATCH  /api/tasks/:id                                  → Update task
DELETE /api/tasks/:id                                  → Delete task
```

---

## 🧪 Testing Endpoints (use Postman/Insomnia)

### 1. Register

```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login

```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: { token, user }
```

### 3. Create Project (use token from login)

```
POST http://localhost:5000/api/projects
Headers: Authorization: Bearer <token>
Body: {
  "title": "My First Project",
  "description": "Learning full stack"
}
```

---

## 🎓 After This Project

After completing this, you'll be ready for:

- **Advanced Backend**: Caching (Redis), real-time (WebSockets), file uploads
- **Advanced Frontend**: State management (Redux/Zustand), animations, performance
- **DevOps**: Docker, deployment, CI/CD pipelines
- **Databases**: Complex queries, migrations, backups
- **Security**: OAuth, encryption, rate limiting

You'll have production fundamentals, not just tutorial code.

---

## 📚 Key Files to Study

**Backend Educational Order:**

1. `src/middleware/errorHandler.js` - Error handling pattern
2. `src/models/User.js` - Schema design
3. `src/services/authService.js` - Business logic
4. `src/controllers/authController.js` - HTTP handling
5. `src/routes/authRoutes.js` - Endpoint definition
6. `src/index.js` - How it all connects

**Frontend Educational Order:**

1. `src/services/api.js` - API client with interceptors
2. `src/hooks/useApi.js` - Async state management
3. `src/context/AuthContext.jsx` - Global state
4. `src/pages/login.jsx` - Component with hooks
5. `src/pages/dashboard.jsx` - Protected page example

---

## ❓ Questions to Ask Yourself

As you build:

- "Why does the controller call a service instead of the database?"
- "Where should validation happen - frontend, controller, or service?"
- "What should I test - component, hook, or service?"
- "How does the token flow from login response to protected requests?"
- "Why do we need Context API if we have fetch?"
- "What happens when API fails - who handles it?"

If you can answer these, you're thinking like a production developer.

---

## 🚨 When Stuck

1. **Check the error message first** - it usually tells you what's wrong
2. **Read the code comments** - they explain the "why"
3. **Trace the flow**: Request → Middleware → Controller → Service → Response
4. **Print/log at each step** - see where it breaks
5. **Read the HTTP status code** - 400 (validation), 401 (auth), 500 (server error)

---

Good luck! You're learning to build production systems, not just "make it work." 🎯
