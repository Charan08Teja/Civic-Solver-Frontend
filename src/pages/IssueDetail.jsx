import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, User, Calendar, MapPin, Send, Trash2, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import CategoryBadge from "../components/CategoryBadge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const issueRes = await API.get("/issues");
      const found = issueRes.data.find((i) => i.id === parseInt(id));
      setIssue(found);

      const commentRes = await API.get(`/issues/${id}/comments`);
      setComments(commentRes.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load issue details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpvote = async () => {
    try {
      await API.post(`/issues/${id}/upvote`);
      fetchData();
      toast.success("Upvoted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upvote");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmittingComment(true);
    try {
      await API.post(`/issues/${id}/comment`, { content: content.trim() });
      setContent("");
      fetchData();
      toast.success("Comment added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/issues/comments/${commentId}`);
      fetchData();
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const statusLabels = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    PENDING: "Pending",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Issue Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The issue you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imageSrc = issue.imageUrl
    ? issue.imageUrl.startsWith("http")
      ? issue.imageUrl
      : `https://civic-solver-backend.onrender.com/${issue.imageUrl}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Issue Card */}
          <Card className="overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
            {/* Large Image Preview */}
            {imageSrc && (
              <div className="relative">
                <img
                  src={imageSrc}
                  alt="issue"
                  className="w-full h-96 md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Status and Category Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full backdrop-blur-sm ${
                      statusColors[issue.status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {statusLabels[issue.status] || "Open"}
                  </span>
                  {issue.category && <CategoryBadge category={issue.category} />}
                </div>
              </div>
            )}

            <CardContent className="p-6 md:p-8">
              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {issue.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Metadata Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reported by</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {issue.user?.name || "Anonymous"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {issue.latitude?.toFixed(4)}, {issue.longitude?.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleUpvote}
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">
                      {issue._count?.upvotes || 0} Upvotes
                    </span>
                  </Button>
                </motion.div>

                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{comments.length} comments</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments ({comments.length})
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts about this issue..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submittingComment || !content.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {comment.user?.name || "Anonymous"}
                            </p>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default IssueDetail;