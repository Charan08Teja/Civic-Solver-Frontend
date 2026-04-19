import { useEffect, useState } from "react";
import API from "../api/axios";

function Admin() {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    try {
      const res = await API.get("/issues/issues"); // admin route
      setIssues(res.data.issues);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const updateStatus = async (id, status) => {
  try {
    console.log("Sending status:", status); // 👈 ADD THIS
    await API.put(`/issues/issues/${id}/status`, { status });
    fetchIssues();
  } catch (error) {
    console.log(error.response); // 👈 ADD THIS
    alert(error.response?.data?.message || "Failed to update");
  }
};

  const deleteIssue = async (id) => {
    try {
      await API.delete(`/issues/issues/${id}`);
      fetchIssues();
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      {issues.map((issue) => (
        <div key={issue.id} className="bg-white p-4 mb-3 rounded shadow">
          <h2 className="font-semibold">{issue.title}</h2>
          <p>{issue.description}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => updateStatus(issue.id, "IN_PROGRESS")}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              In Progress
            </button>

            <button
              onClick={() => updateStatus(issue.id, "RESOLVED")}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Resolve
            </button>

            <button
              onClick={() => deleteIssue(issue.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;