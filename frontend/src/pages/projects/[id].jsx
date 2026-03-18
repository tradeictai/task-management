"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { commentAPI, projectAPI, taskAPI } from "@/services/authService";

const TASK_STATUS = ["todo", "in-progress", "completed"];

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [projectId, setProjectId] = useState("");
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [error, setError] = useState("");

  const [commentsByTask, setCommentsByTask] = useState({});
  const [openCommentsTaskId, setOpenCommentsTaskId] = useState("");
  const [newCommentByTask, setNewCommentByTask] = useState({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (typeof window !== "undefined") {
      const id = window.location.pathname.split("/").pop();
      setProjectId(id);
    }
  }, [user, isLoading, router]);

  const loadProjectAndTasks = async (id, query = {}) => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        projectAPI.getProject(id),
        taskAPI.getProjectTasks(id, query),
      ]);
      setProject(projectResponse.data);
      setTasks(tasksResponse.data.items || []);
      setPagination(tasksResponse.data.pagination || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProjectAndTasks(projectId, {
        page,
        limit,
        search: taskSearch,
        status: taskStatus || undefined,
      });
    }
  }, [projectId, page, taskSearch, taskStatus]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError("Task title is required");
      return;
    }

    setCreatingTask(true);
    setError("");
    try {
      await taskAPI.createTask(projectId, {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
      });
      setNewTask({ title: "", description: "", priority: "medium" });
      setShowTaskForm(false);
      await loadProjectAndTasks(projectId, {
        page: 1,
        limit,
        search: taskSearch,
        status: taskStatus || undefined,
      });
      setPage(1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const previousTasks = tasks;
    const newStatus = task.status === "completed" ? "todo" : "completed";

    setTasks((prev) =>
      prev.map((item) =>
        item._id === task._id ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      await taskAPI.updateTask(task._id, { status: newStatus });
    } catch (err) {
      setTasks(previousTasks);
      setError(err?.response?.data?.message || "Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((task) => task._id !== taskId));

    try {
      await taskAPI.deleteTask(taskId);
    } catch (err) {
      setTasks(previousTasks);
      setError(err?.response?.data?.message || "Failed to delete task");
    }
  };

  const loadComments = async (taskId) => {
    try {
      const response = await commentAPI.getTaskComments(taskId);
      setCommentsByTask((prev) => ({ ...prev, [taskId]: response.data || [] }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load comments");
    }
  };

  const toggleComments = async (taskId) => {
    if (openCommentsTaskId === taskId) {
      setOpenCommentsTaskId("");
      return;
    }

    setOpenCommentsTaskId(taskId);
    if (!commentsByTask[taskId]) {
      await loadComments(taskId);
    }
  };

  const handleAddComment = async (taskId) => {
    const text = (newCommentByTask[taskId] || "").trim();
    if (!text) return;

    try {
      const response = await commentAPI.addComment(taskId, text);
      setCommentsByTask((prev) => ({
        ...prev,
        [taskId]: [response.data, ...(prev[taskId] || [])],
      }));
      setNewCommentByTask((prev) => ({ ...prev, [taskId]: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (taskId, commentId) => {
    const previousComments = commentsByTask[taskId] || [];
    setCommentsByTask((prev) => ({
      ...prev,
      [taskId]: previousComments.filter((c) => c._id !== commentId),
    }));

    try {
      await commentAPI.deleteComment(taskId, commentId);
    } catch (err) {
      setCommentsByTask((prev) => ({ ...prev, [taskId]: previousComments }));
      setError(err?.response?.data?.message || "Failed to delete comment");
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length;
    return { total, completed };
  }, [tasks]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {project?.title || "Project"}
            </h1>
            <p className="text-gray-600">
              {project?.description || "No description"}
            </p>
          </div>
          <div className="text-right text-sm text-gray-700">
            <p>Total tasks: {stats.total}</p>
            <p>Completed: {stats.completed}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={taskSearch}
            onChange={(e) => {
              setTaskSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search tasks"
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={taskStatus}
            onChange={(e) => {
              setTaskStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All statuses</option>
            {TASK_STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowTaskForm((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Task
          </button>
          <button
            onClick={() =>
              loadProjectAndTasks(projectId, {
                page,
                limit,
                search: taskSearch,
                status: taskStatus || undefined,
              })
            }
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>

        {showTaskForm && (
          <form
            onSubmit={handleCreateTask}
            className="bg-white p-5 rounded-lg shadow mb-6 space-y-3"
          >
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Task title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Task description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creatingTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {creatingTask ? "Creating..." : "Create Task"}
              </button>
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-5 rounded-lg shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <p className="text-gray-600">
                    {task.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Status: {task.status} • Priority: {task.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {task.status === "completed" ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleComments(task._id)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Comments
                  </button>
                </div>
              </div>

              {openCommentsTaskId === task._id && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newCommentByTask[task._id] || ""}
                      onChange={(e) =>
                        setNewCommentByTask((prev) => ({
                          ...prev,
                          [task._id]: e.target.value,
                        }))
                      }
                      placeholder="Add comment"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => handleAddComment(task._id)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(commentsByTask[task._id] || []).map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-50 px-3 py-2 rounded-md flex justify-between items-start gap-2"
                      >
                        <div>
                          <p className="text-sm text-gray-900">
                            {comment.text}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {comment.author?.name || "User"}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleDeleteComment(task._id, comment._id)
                          }
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {(commentsByTask[task._id] || []).length === 0 && (
                      <p className="text-sm text-gray-500">No comments yet</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-600">No tasks found for this filter</p>
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
