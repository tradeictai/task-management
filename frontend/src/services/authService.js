import api from "./api";

// ============================================
// AUTH API CALLS
// Phase 2: Authentication
// ============================================

export const authAPI = {
  // Register new user
  register: async (email, password, name) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// ============================================
// PROJECT API CALLS
// Phase 3: Projects CRUD
// ============================================

export const projectAPI = {
  // Create project
  createProject: async (title, description) => {
    const response = await api.post("/projects", { title, description });
    return response.data;
  },

  // Get all user projects (with search + pagination)
  getUserProjects: async (params = {}) => {
    const response = await api.get("/projects", { params });
    return response.data;
  },

  // Get single project
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Update project
  updateProject: async (id, updates) => {
    const response = await api.patch(`/projects/${id}`, updates);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// ============================================
// TASK API CALLS
// Phase 4: Tasks
// ============================================

export const taskAPI = {
  // Create task
  createTask: async (projectId, taskData) => {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
  },

  // Get all tasks in project (with filters + pagination)
  getProjectTasks: async (projectId, params = {}) => {
    const response = await api.get(`/projects/${projectId}/tasks`, { params });
    return response.data;
  },

  // Get single task
  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, updates) => {
    const response = await api.patch(`/tasks/${taskId}`, updates);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Get tasks by status
  getTasksByStatus: async (projectId, status) => {
    const response = await api.get(
      `/projects/${projectId}/tasks/status/${status}`,
    );
    return response.data;
  },
};

export const commentAPI = {
  addComment: async (taskId, text) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { text });
    return response.data;
  },

  getTaskComments: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  deleteComment: async (taskId, commentId) => {
    const response = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  },
};
