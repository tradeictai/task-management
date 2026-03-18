// ============================================
// DASHBOARD PAGE
// Phase 1: First page after login
// Phase 3: Show projects
// ============================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { projectAPI } from "@/services/authService";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const {
    data: projects,
    loading,
    error,
    execute: fetchProjects,
  } = useApi(projectAPI.getUserProjects);
  const {
    loading: isCreating,
    error: createError,
    execute: createProject,
  } = useApi(projectAPI.createProject);

  const projectItems = projects?.items || [];
  const pagination = projects?.pagination;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Fetch projects on mount
  useEffect(() => {
    if (user) {
      fetchProjects({ page, limit, search });
    }
  }, [user, fetchProjects, page, search]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedTitle = newProject.title.trim();
    if (!trimmedTitle) {
      setFormError("Project title is required");
      return;
    }

    try {
      await createProject(trimmedTitle, newProject.description.trim());
      setNewProject({ title: "", description: "" });
      setShowCreateForm(false);
      await fetchProjects({ page, limit, search });
    } catch (err) {
      // Error is exposed through createError
    }
  };

  if (isLoading) {
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Projects
          </h2>
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search projects"
              className="w-full md:max-w-sm px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => {
                setShowCreateForm((prev) => !prev);
                setFormError("");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              + New Project
            </button>
          </div>
        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreateProject}
            className="bg-white p-6 rounded-lg shadow mb-8 space-y-4"
          >
            {(formError || createError) && (
              <p className="text-red-600 text-sm">{formError || createError}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="Project title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="Short description"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create Project"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewProject({ title: "", description: "" });
                  setFormError("");
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading && <p className="text-gray-600">Loading projects...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {projectItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectItems.map((project) => (
              <div
                key={project._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <Link
                  href={`/projects/${project._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No projects yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-blue-600 hover:underline"
            >
              Create first project
            </button>
          </div>
        )}

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
