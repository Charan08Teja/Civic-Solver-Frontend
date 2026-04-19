import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Home() {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  const fetchIssues = async () => {
    try {
      const res = await API.get("/issues");
      setIssues(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleUpvote = async (issueId) => {
    try {
      await API.post(`/issues/${issueId}/upvote`);
      fetchIssues();
    } catch (error) {
      alert(error.response?.data?.message || "Upvote failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-xl p-4">
        <h1 className="text-2xl font-bold mb-4">Issues</h1>

        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => navigate(`/issue/${issue.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
            >
              {/* Image */}
              {issue.imageUrl && (
                <img
                  src={`http://localhost:5000/${issue.imageUrl}`}
                  alt="issue"
                  className="w-full max-h-[400px] object-cover"
                />
              )}

              {/* Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">
                  {issue.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {issue.description}
                </p>

                <div className="text-sm text-gray-500 mt-2">
                  👤 {issue.user.name}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span>👍 {issue._count.upvotes} upvotes</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(issue.id);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Upvote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;