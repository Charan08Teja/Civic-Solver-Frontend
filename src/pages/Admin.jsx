import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Button from "../components/Button";

function Admin() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const checkAdmin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/issues/me");

      // ✅ FIXED CHECK
      if (res.data.role !== "ADMIN") {
        navigate("/");
        return;
      }

      setUser(res.data);
    } catch (error) {
      navigate("/");
    }
  };

  checkAdmin();
}, [navigate]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/issues/issues"); // admin route
      setIssues(res.data.issues);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      console.log("Sending status:", status);
      await API.put(`/issues/issues/${id}/status`, { status });
      fetchIssues();
    } catch (error) {
      console.log(error.response);
      alert(error.response?.data?.message || "Failed to update");
    }
  };

  const deleteIssue = async (id) => {
    if (window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      try {
        await API.delete(`/issues/issues/${id}`);
        fetchIssues();
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage and update community issues</p>
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No issues to manage</h3>
            <p className="text-gray-600">All issues have been resolved or there are no reported issues yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{issue.title}</h2>
                    <p className="text-gray-600 mb-3">{issue.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>👤 {issue.user?.name || 'Anonymous'}</span>
                      <span>👍 {issue._count?.upvotes || 0} upvotes</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusColors[issue.status] || 'bg-gray-100 text-gray-800'}`}>
                      {issue.status || 'OPEN'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateStatus(issue.id, "IN_PROGRESS")}
                    disabled={issue.status === "IN_PROGRESS"}
                  >
                    Mark In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => updateStatus(issue.id, "RESOLVED")}
                    disabled={issue.status === "RESOLVED"}
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteIssue(issue.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;