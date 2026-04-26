import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import IssueCard from "../components/IssueCard";
import Button from "../components/Button";

function Home() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/issues");
      setIssues(res.data);
      setFilteredIssues(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    if (filter === "ALL") {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.status === filter));
    }
  }, [issues, filter]);

  const handleUpvote = async (issueId) => {
    try {
      await API.post(`/issues/${issueId}/upvote`);
      fetchIssues();
    } catch (error) {
      alert(error.response?.data?.message || "Upvote failed");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Issues</h1>
            <p className="text-gray-600 mt-1">Report and track civic problems in your area</p>
          </div>
          <Button onClick={() => navigate("/create")} className="mt-4 sm:mt-0">
            Report New Issue
          </Button>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  filter === status
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status === "ALL" ? "All Issues" : status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Issues Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600">Be the first to report an issue in your community.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;