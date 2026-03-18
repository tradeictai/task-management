# SETUP INSTRUCTIONS - READ FIRST

## 🎯 What Has Been Created

You now have a **complete project structure** with:

### Backend

- ✅ Express server with proper middleware
- ✅ MongoDB models (User, Project, Task)
- ✅ Service layer with business logic
- ✅ Error handling system
- ✅ JWT authentication
- ✅ Route structure

### Frontend

- ✅ Next.js app
- ✅ API client with axios interceptors
- ✅ Auth context + useAuth hook
- ✅ Custom hooks (useApi, useForm)
- ✅ Login, Register, Dashboard pages
- ✅ TailwindCSS styling

---

## ⚙️ Requirements Before Running

Make sure you have installed:

```bash
# Check versions
node --version    # Should be v18+
mongodb --version # If local
redis-cli --version # If local
```

---

## 🚀 QUICK START (5 minutes)

### Step 1: Install Backend Dependencies

```bash
cd /Users/sanjaysen/Desktop/practice/backend
npm install
```

### Step 2: Create .env File

```bash
cp .env.example .env
```

Edit `.env`:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_will_work_for_now
JWT_EXPIRE=7d
```

### Step 3: Install Frontend Dependencies

```bash
cd /Users/sanjaysen/Desktop/practice/frontend
npm install
```

### Step 4: Create Frontend .env.local

```bash
cp .env.local.example .env.local
```

The file should have:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 5: Make Sure MongoDB & Redis are Running

**Option A: Using Docker (Easiest)**

```bash
# Start both MongoDB and Redis
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker run -d -p 6379:6379 --name redis redis:latest
```

**Option B: Local Installation**

```bash
# Make sure MongoDB is running
brew services start mongodb-community

# Make sure Redis is running
brew services start redis
```

---

## ✅ Run the Project

### Terminal 1: Start Backend

```bash
cd /Users/sanjaysen/Desktop/practice/backend
npm run dev
```

You should see:

```
✓ MongoDB connected: localhost
✓ Redis connected
✓ Server running on port 5000
```

### Terminal 2: Start Frontend

```bash
cd /Users/sanjaysen/Desktop/practice/frontend
npm run dev
```

You should see:

```
- Local: http://localhost:3000
```

### Step 6: Test in Browser

1. Go to `http://localhost:3000`
2. Click "Register"
3. Fill in: Name, Email, Password
4. Should redirect to Dashboard
5. See "Your Projects" section

---

## 🧪 Test Backend Without Frontend

Use Postman/Insomnia or curl:

### Test 1: Health Check

```bash
curl http://localhost:5000/api/health
```

Response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

### Test 2: Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the `token` from response.

### Test 4: Protected Route (Get Current User)

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <paste_token_here>"
```

---

## 📖 What to Study First

1. **Read**: `/Users/sanjaysen/Desktop/practice/README.md` - Full project documentation

2. **Backend Flow** (understand this first):
   - [backend/src/index.js](../backend/src/index.js) - Entry point
   - [backend/src/middleware/authentication.js](../backend/src/middleware/authentication.js) - How tokens work
   - [backend/src/services/authService.js](../backend/src/services/authService.js) - Business logic
   - [backend/src/controllers/authController.js](../backend/src/controllers/authController.js) - HTTP handling

3. **Frontend Flow**:
   - [frontend/src/services/api.js](../frontend/src/services/api.js) - How frontend talks to backend
   - [frontend/src/context/AuthContext.jsx](../frontend/src/context/AuthContext.jsx) - Global state
   - [frontend/src/pages/login.jsx](../frontend/src/pages/login.jsx) - Example component

---

## 🎓 First Challenges (Do These in Order)

### Challenge 1: Add a New Project (Phase 3)

**Goal**: Create projects from dashboard

1. Open [frontend/src/pages/dashboard.jsx](../frontend/src/pages/dashboard.jsx)
2. Look at the "+ New Project" button
3. Add click handler to show form
4. Call `projectAPI.createProject()` from hook
5. Refresh projects list

### Challenge 2: View Project Tasks (Phase 4)

**Goal**: Click on project to see tasks

1. Create new page: `frontend/src/pages/project/[id].jsx`
2. Fetch tasks using `taskAPI.getProjectTasks()`
3. Display tasks list

### Challenge 3: Create Task (Phase 4)

**Goal**: Add tasks to project

1. Add form to project page
2. Call `taskAPI.createTask(projectId, taskData)`
3. Show loading state while submitting
4. Add error handling

---

## 🐛 If Something Breaks

### Backend won't start

```bash
# Check port 5000 is free
lsof -i :5000

# Kill process using port
kill -9 <PID>
```

### MongoDB connection error

```bash
# Check MongoDB is running
brew services list | grep mongodb

# Start if not running
brew services start mongodb-community
```

### Frontend shows blank page

```bash
# Check console (F12 → Console tab)
# Common: .env.local not set correctly
# Fix: Restart dev server after changing .env.local

npm run dev
```

### "Cannot find module" errors

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

---

## 📚 File Structure Map

```
/Users/sanjaysen/Desktop/practice/
├── backend/
│   ├── src/
│   │   ├── config/          ← DB setup
│   │   ├── middleware/      ← Auth, errors
│   │   ├── models/          ← MongoDB schemas
│   │   ├── services/        ← Business logic
│   │   ├── controllers/     ← HTTP handlers
│   │   ├── routes/          ← Endpoints
│   │   ├── utils/           ← Helpers
│   │   └── index.js         ← Server start
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/             ← Next.js app
│   │   ├── pages/           ← Page components
│   │   ├── components/      ← UI components
│   │   ├── hooks/           ← Custom hooks
│   │   ├── context/         ← Global state
│   │   ├── services/        ← API calls
│   │   └── utils/           ← Helpers
│   ├── package.json
│   └── .env.local.example
│
└── README.md                ← Full documentation
```

---

## ✨ Architecture Summary (Key to Understand)

### Backend Request Flow

```
HTTP Request
    ↓
Route (authRoutes.js)
    ↓
Middleware (authenticate, validate)
    ↓
Controller (authController.js)
    ↓
Service (authService.js)
    ↓
Model (User.js) / Database
    ↓
Response JSON
```

### Frontend State Flow

```
User Action (click, form submit)
    ↓
Event Handler
    ↓
useApi Hook (calls service)
    ↓
API Call (services/authService.js)
    ↓
Backend Response
    ↓
Update State
    ↓
Re-render Component
```

---

## 🎯 Next Steps After Setup

1. **Run the project** and test the flow
2. **Read the README** - understand the philosophy
3. **Study one service** - authService.js
4. **Build Challenge 1** - Create first project
5. **Build Challenge 2** - View project tasks
6. **Build Challenge 3** - Create first task

Then you'll understand the architecture!

---

## 💡 Pro Tips

- **Always check the network tab** (F12 → Network) to see API requests
- **Console logs are your friend** - add logs to see what's happening
- **Test backend first**, then frontend - errors are easier to debug
- **Read error messages carefully** - they usually tell you what's wrong
- **Use Postman/Insomnia** to test backend before worrying about frontend

---

**You're ready to build! 🚀**

Questions? Check the README or re-read the code comments.
