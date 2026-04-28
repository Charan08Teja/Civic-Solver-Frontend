import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, User, Calendar } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const IssueCard = ({ issue, onUpvote }) => {
  const navigate = useNavigate();

  const statusColors = {
    OPEN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    PENDING: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  const statusLabels = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    PENDING: "Pending",
  };

  // Smart image URL handling
  const imageSrc = issue.imageUrl
    ? issue.imageUrl.startsWith("http")
      ? issue.imageUrl // Cloudinary URL
      : `https://civic-solver-backend.onrender.com/${issue.imageUrl}` // old local uploads
    : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/issue/${issue.id}`)}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        {/* Image with overlay */}
        <div className="relative h-48 overflow-hidden">
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt="issue"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                statusColors[issue.status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {statusLabels[issue.status] || "Open"}
            </span>
          </div>

          {/* Category Badge */}
          {issue.category && (
            <div className="absolute top-3 left-3">
              <CategoryBadge category={issue.category} />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {issue.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {issue.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{issue.user?.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Upvote Button */}
          <div className="flex justify-end">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvote(issue.id);
                }}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className="h-4 w-4" />
                </motion.div>
                <span className="font-medium">
                  {issue._count?.upvotes || 0}
                </span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IssueCard;