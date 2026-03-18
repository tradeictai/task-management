# 🔧 QUICK REFERENCE - Common Tasks & Patterns

Use this as a quick lookup when building features.

---

## 📝 Adding a New Feature (Template)

### Step 1: Define Endpoint

```
1. What data comes in? (request body)
2. What data goes out? (response)
3. Who can access it? (public/authenticated)
4. Example: POST /api/projects, creates project, returns project object
```

### Step 2: Create Model (if needed)

File: `backend/src/models/Feature.js`

```javascript
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const FeatureName = mongoose.model("FeatureName", schema);
```

### Step 3: Create Service (business logic)

File: `backend/src/services/featureService.js`

```javascript
import { FeatureName } from "../models/FeatureName.js";
import { createError } from "../utils/errors.js";

export const featureService = {
  createFeature: async (title, userId) => {
    const feature = new FeatureName({ title, owner: userId });
    await feature.save();
    return feature;
  },

  getFeatures: async (userId) => {
    return await FeatureName.find({ owner: userId });
  },

  updateFeature: async (id, userId, updates) => {
    const feature = await FeatureName.findById(id);
    if (!feature) throw createError.notFound("Not found");
    if (feature.owner.toString() !== userId) {
      throw createError.forbidden("Not your resource");
    }
    Object.assign(feature, updates);
    await feature.save();
    return feature;
  },
};
```

### Step 4: Create Controller (HTTP handler)

File: `backend/src/controllers/featureController.js`

```javascript
import { featureService } from "../services/featureService.js";
import { successResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const featureController = {
  createFeature: asyncHandler(async (req, res) => {
    const feature = await featureService.createFeature(
      req.body.title,
      req.user.userId,
    );
    successResponse(res, feature, "Created", 201);
  }),

  getFeatures: asyncHandler(async (req, res) => {
    const features = await featureService.getFeatures(req.user.userId);
    successResponse(res, features, "Fetched");
  }),
};
```

### Step 5: Create Routes

File: `backend/src/routes/featureRoutes.js`

```javascript
import express from "express";
import { featureController } from "../controllers/featureController.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();
router.use(authenticate); // All routes need auth

router.post("/", featureController.createFeature);
router.get("/", featureController.getFeatures);

export default router;
```

### Step 6: Register Routes in index.js

```javascript
import featureRoutes from "./routes/featureRoutes.js";
app.use("/api/features", featureRoutes);
```

### Step 7: Create Frontend API Service

File: `frontend/src/services/authService.js`

```javascript
export const featureAPI = {
  create: async (title) => {
    const response = await api.post("/features", { title });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get("/features");
    return response.data;
  },
};
```

### Step 8: Use in Frontend Component

```javascript
"use client";
import { useApi } from "@/hooks/useApi";
import { featureAPI } from "@/services/authService";

export default function FeaturesPage() {
  const {
    data: features,
    loading,
    execute: fetchFeatures,
  } = useApi(featureAPI.getAll);

  useEffect(() => {
    fetchFeatures();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {features?.map((f) => (
        <div key={f._id}>{f.title}</div>
      ))}
    </div>
  );
}
```

---

## 🔄 Common Patterns

### Pattern 1: Get User's Resources (with ownership check)

```javascript
// Service
getMyResources: (async (userId) => {
  return await Resource.find({ owner: userId });
},
  // In route:
  router.get("/", authenticate, resourceController.getMyResources));

// Frontend:
const { data } = await api.get("/resources");
```

### Pattern 2: Update with Ownership Verification

```javascript
// Service
update: async (id, userId, updates) => {
  const resource = await Resource.findById(id);
  if (!resource) throw createError.notFound('Not found');
  if (resource.owner.toString() !== userId) {
    throw createError.forbidden('Access denied');
  }
  Object.assign(resource, updates);
  await resource.save();
  return resource;
},
```

### Pattern 3: Delete with Verification

```javascript
delete: async (id, userId) => {
  const resource = await Resource.findById(id);
  if (!resource) throw createError.notFound('Not found');
  if (resource.owner.toString() !== userId) {
    throw createError.forbidden('Access denied');
  }
  await Resource.findByIdAndDelete(id);
  return { message: 'Deleted' };
},
```

### Pattern 4: Nested Resources (Project → Tasks)

```javascript
// Routes: /api/projects/:projectId/tasks
import taskRoutes from './routes/taskRoutes.js';
app.use('/api/projects/:projectId/tasks', taskRoutes);

// Service always verifies project ownership
getTasks: async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw createError.notFound('Project not found');
  if (project.owner.toString() !== userId) {
    throw createError.forbidden('Access denied');
  }
  return await Task.find({ project: projectId });
},
```

### Pattern 5: Filter/Search

```javascript
// Backend
getTasks: async (projectId, userId, status = null) => {
  const query = { project: projectId };
  if (status) query.status = status;
  return await Task.find(query);
},

// Frontend
const getByStatus = async (status) => {
  return await api.get(`/projects/${projectId}/tasks?status=${status}`);
},

// Or use separate endpoint
getTasks: async (projectId, status) => {
  return await api.get(`/projects/${projectId}/tasks/status/${status}`);
},
```

---

## 🎨 Frontend Patterns

### Pattern 1: Form with Validation

```javascript
const { values, errors, handleChange, handleSubmit } = useForm(
  { title: "", description: "" },
  async (values) => {
    await featureAPI.create(values);
    // Success
  },
);

return (
  <form onSubmit={handleSubmit}>
    <input name="title" value={values.title} onChange={handleChange} />
    {errors.title && <p className="error">{errors.title}</p>}
    <button type="submit">Submit</button>
  </form>
);
```

### Pattern 2: Async Data Fetch

```javascript
const { data, loading, error, execute } = useApi(featureAPI.getAll);

useEffect(() => {
  execute();
}, []);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return (
  <div>
    {data?.map((item) => (
      <div key={item._id}>{item.title}</div>
    ))}
  </div>
);
```

### Pattern 3: Protected Page

```javascript
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Welcome, {user.name}</div>;
}
```

### Pattern 4: Optimistic Update (Phase 5)

```javascript
const [tasks, setTasks] = useState([]);

const completeTask = async (taskId) => {
  // Optimistic: update UI immediately
  setTasks(
    tasks.map((t) => (t._id === taskId ? { ...t, status: "completed" } : t)),
  );

  try {
    // Then sync with server
    await taskAPI.updateTask(taskId, { status: "completed" });
  } catch (error) {
    // Rollback on error
    setTasks(
      tasks.map((t) => (t._id === taskId ? { ...t, status: "todo" } : t)),
    );
    console.error("Failed to complete task");
  }
};
```

---

## 🆘 Error Handling

### Backend: How to Throw Errors

```javascript
// Don't do this:
if (!user) res.status(404).json({ message: "Not found" });

// Do this:
if (!user) throw createError.notFound("User not found");

// The asyncHandler middleware catches it and responds
```

### Common Error Types

```javascript
createError.validation("Field is required"); // 400
createError.unauthorized("Invalid token"); // 401
createError.forbidden("Access denied"); // 403
createError.notFound("Resource not found"); // 404
createError.conflict("Already exists"); // 409
createError.server("Internal error"); // 500
```

### Frontend: Handle Errors

```javascript
const { error, execute } = useApi(apiFunction);

const handleSubmit = async () => {
  try {
    await execute(args);
    // Success
  } catch (err) {
    // Error stored in 'error' state automatically
  }
};

return (
  <div>
    {error && <div className="alert alert-error">{error}</div>}
    <button onClick={handleSubmit}>Submit</button>
  </div>
);
```

---

## 📊 MongoDB Query Examples

### Find Owner's Resources

```javascript
Resource.find({ owner: userId });
```

### Find and Update

```javascript
const updated = await Resource.findByIdAndUpdate(
  id,
  { title: "New title" },
  { new: true }, // Return updated doc
);
```

### Find and Delete

```javascript
await Resource.findByIdAndDelete(id);
```

### Find with Population (get related data)

```javascript
const project = await Project.findById(id).populate("owner", "name email"); // Get owner details
```

### Find with Sorting

```javascript
await Task.find({ project: projectId }).sort({ createdAt: -1 }); // Most recent first
```

### Find with Filtering

```javascript
await Task.find({
  project: projectId,
  status: "completed",
});
```

---

## 🧪 Testing Checklist

For each new endpoint, test:

1. **Happy Path** (everything works)

   ```bash
   curl -X POST http://localhost:5000/api/features \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"title":"My Feature"}'
   ```

2. **No Auth** (without token)

   ```bash
   curl -X POST http://localhost:5000/api/features \
     -H "Content-Type: application/json" \
     -d '{"title":"My Feature"}'
   # Should return 401
   ```

3. **Invalid Data** (missing required field)

   ```bash
   curl -X POST http://localhost:5000/api/features \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"description":"No title!"}'
   # Should return 400 validation error
   ```

4. **Access Control** (access someone else's resource)
   - Create resource as User A
   - Delete as User B
   - Should return 403

---

## 🔑 Key Files to Reference

**When you need to...**

| Task                      | File                                        |
| ------------------------- | ------------------------------------------- |
| Understand error handling | `backend/src/utils/errors.js`               |
| Handle async requests     | `frontend/src/hooks/useApi.js`              |
| Check auth flow           | `backend/src/middleware/authentication.js`  |
| See service pattern       | `backend/src/services/authService.js`       |
| See controller pattern    | `backend/src/controllers/authController.js` |
| See frontend form         | `frontend/src/pages/login.jsx`              |
| Add new route             | `backend/src/routes/authRoutes.js`          |
| Store global state        | `frontend/src/context/AuthContext.jsx`      |

---

## 💡 Pro Tips

1. **Always check that error message** - it tells you what's wrong
2. **Console.log in service** - see what data you're working with
3. **Use Postman** - test backend before touching frontend
4. **Check DevTools Network tab** - see actual API requests
5. **Remember: Service throws, Controller responds** - they have different jobs
6. **Frontend API service always calls Backend service** - don't skip this layer
7. **Every protected endpoint needs `authenticate` middleware** - otherwise anyone can access

---

## 🎯 When Adding New Feature, Follow This Order

1. Create MongoDB model in `backend/src/models/`
2. Create service in `backend/src/services/`
3. Create controller in `backend/src/controllers/`
4. Create routes in `backend/src/routes/`
5. Register routes in `backend/src/index.js`
6. Create API service in `frontend/src/services/`
7. Create component in `frontend/src/pages/` or `frontend/src/components/`

This order ensures the data layer is solid before adding UI.

**Happy coding! 🚀**
