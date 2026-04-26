import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import CategoryBadge from './CategoryBadge';

const IssueCard = ({ issue, onUpvote }) => {
  const navigate = useNavigate();

  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
  };

  return (
    <div
      onClick={() => navigate(`/issue/${issue.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-200"
    >
      {/* Image */}
      {issue.imageUrl && (
        <img
          src={`https://civic-solver-backend.onrender.com/${issue.imageUrl}`}
          alt="issue"
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {issue.title}
          </h2>
          <div className="flex flex-col space-y-2 ml-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[issue.status] || 'bg-gray-100 text-gray-800'}`}>
              {issue.status || 'OPEN'}
            </span>
            {issue.category && <CategoryBadge category={issue.category} />}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {issue.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>👤 {issue.user?.name || 'Anonymous'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(issue.id);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <span>👍</span>
              <span className="text-sm font-medium">{issue._count?.upvotes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;