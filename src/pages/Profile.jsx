import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Heart, MessageCircle, Calendar, Award, TrendingUp } from "lucide-react";
import API from "../api/axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import CategoryBadge from "../components/CategoryBadge";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Profile not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Unable to load your profile information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const myIssues = user.issues || [];
  const upvotedIssues = user.upvotes?.map(upvote => upvote.issue) || [];

  const stats = [
    {
      icon: MapPin,
      label: "Issues Reported",
      value: myIssues.length,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Heart,
      label: "Upvotes Given",
      value: upvotedIssues.length,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      icon: MessageCircle,
      label: "Total Upvotes",
      value: myIssues.reduce((sum, issue) => sum + (issue._count?.upvotes || 0), 0),
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Award,
      label: "Resolved Issues",
      value: myIssues.filter(issue => issue.status === "RESOLVED").length,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-8">
            <div className="relative">
              {/* Background gradient */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

              <CardContent className="relative -mt-16 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white dark:border-gray-800">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {user.email}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Community Member</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => window.location.href = "/create"}
                    className="shadow-lg"
                  >
                    Report New Issue
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="myIssues" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="myIssues" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                My Issues ({myIssues.length})
              </TabsTrigger>
              <TabsTrigger value="upvoted" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Upvoted ({upvotedIssues.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="myIssues">
              <IssuesGrid issues={myIssues} emptyMessage="No issues posted yet" emptySubmessage="Start reporting civic issues to see them here." showCreateButton={true} />
            </TabsContent>

            <TabsContent value="upvoted">
              <IssuesGrid issues={upvotedIssues} emptyMessage="No upvoted issues yet" emptySubmessage="Upvote issues to show your support and see them here." showCreateButton={false} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

// Reusable component for issues grid
function IssuesGrid({ issues, emptyMessage, emptySubmessage, showCreateButton }) {
  if (issues.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {emptySubmessage}
          </p>
          {showCreateButton && (
            <Button onClick={() => window.location.href = "/create"}>
              Create Your First Issue
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {issues.map((issue, index) => (
        <motion.div
          key={issue.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <ProfileIssueCard issue={issue} />
        </motion.div>
      ))}
    </div>
  );
}

// Reusable component for issue cards in profile
function ProfileIssueCard({ issue }) {
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

  const imageSrc = issue.imageUrl
    ? issue.imageUrl.startsWith("http")
      ? issue.imageUrl
      : `https://civic-solver-backend.onrender.com/${issue.imageUrl}`
    : null;

  return (
    <Card
      className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => window.location.href = `/issue/${issue.id}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt="issue"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
          <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${statusColors[issue.status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}>
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
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {issue.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {issue.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Heart className="h-4 w-4" />
            <span>{issue._count?.upvotes || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Profile;