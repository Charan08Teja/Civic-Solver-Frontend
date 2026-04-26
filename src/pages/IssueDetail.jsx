import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import CategoryBadge from "../components/CategoryBadge";

function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchData = async () => {
    try {
      const issueRes = await API.get("/issues");
      const found = issueRes.data.find((i) => i.id === parseInt(id));
      setIssue(found);

      const commentRes = await API.get(`/issues/${id}/comments`);
      setComments(commentRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/issues/${id}/comment`, { content });
      setContent("");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/issues/comments/${commentId}`);
      fetchData();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
  };

  if (!issue) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-blue-50 min-h-screen flex justify-center">
      <div className="w-full max-w-xl p-4">
        
        {/* 🧾 Issue Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-5">
          
          {/* 🖼️ FULL IMAGE */}
          {issue.imageUrl && (
  <img
    src={
      issue.imageUrl.startsWith("http")
        ? issue.imageUrl
        : `https://civic-solver-backend.onrender.com/${issue.imageUrl}`
    }
    alt="issue"
    className="w-full max-h-[500px] object-contain bg-black"
  />
)}

          {/* Content */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-1">
              {issue.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {issue.description}
            </p>

            {/* Issue Metadata */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[issue.status] || 'bg-gray-100 text-gray-800'}`}>
                {issue.status || 'OPEN'}
              </span>
              {issue.category && <CategoryBadge category={issue.category} />}
              <span className="text-sm text-gray-500">
                👤 {issue.user?.name || 'Anonymous'}
              </span>
              <span className="text-sm text-gray-500">
                👍 {issue._count?.upvotes || 0} upvotes
              </span>
            </div>
          </div>
        </div>

        {/* 💬 Comments */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="font-bold mb-3">Comments</h3>

          <form onSubmit={handleAddComment} className="mb-4">
            <input
              type="text"
              placeholder="Add a comment"
              className="w-full p-2 border rounded mb-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              Add Comment
            </button>
          </form>

          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="border-b py-2 flex justify-between items-center"
              >
                <div>
                  <p>{c.content}</p>
                  <span className="text-sm text-gray-500">
                    — {c.user.name}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default IssueDetail;