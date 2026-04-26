import { useEffect, useState } from "react";
import API from "../api/axios";
import Button from "../components/Button";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("myIssues");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get("/issues/me");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  const myIssues = user.issues || [];
  const upvotedIssues = user.upvotes?.map(upvote => upvote.issue) || [];

  const tabs = [
    { id: "myIssues", label: "My Issues", count: myIssues.length },
    { id: "upvoted", label: "Upvoted Issues", count: upvotedIssues.length },
  ];

  const currentIssues = activeTab === "myIssues" ? myIssues : upvotedIssues;

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-6">{user.email}</p>

              {/* Stats */}
              <div className="flex justify-center sm:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{myIssues.length}</div>
                  <div className="text-sm text-gray-600">Issues Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{upvotedIssues.length}</div>
                  <div className="text-sm text-gray-600">Upvotes Given</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span className="ml-2 text-sm text-gray-500">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {currentIssues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  {activeTab === "myIssues" ? "📝" : "👍"}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {activeTab === "myIssues" ? "No issues posted yet" : "No upvoted issues yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "myIssues"
                    ? "Start reporting civic issues to see them here."
                    : "Upvote issues to show your support and see them here."
                  }
                </p>
                {activeTab === "myIssues" && (
                  <Button onClick={() => window.location.href = "/create"}>
                    Create Your First Issue
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentIssues.map((issue) => (
                  <ProfileIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable component for issue cards in profile
function ProfileIssueCard({ issue }) {
  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => window.location.href = `/issue/${issue.id}`}
    >
      {/* Image */}
      {issue.imageUrl ? (
        <img
          src={`http://localhost:5000/${issue.imageUrl}`}
          alt="issue"
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-4xl">📷</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {issue.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[issue.status] || 'bg-gray-100 text-gray-800'}`}>
            {issue.status || 'OPEN'}
          </span>
          <span className="text-sm text-gray-500">👍 {issue._count?.upvotes || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;