import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, CheckCircle, TrendingUp, Filter, Search, Plus } from "lucide-react";
import API from "../api/axios";
import IssueCard from "../components/IssueCard";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

function Home() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
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
    let filtered = issues;

    // Apply status filter
    if (filter !== "ALL") {
      filtered = filtered.filter(issue => issue.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredIssues(filtered);
  }, [issues, filter, searchTerm]);

  const handleUpvote = async (issueId) => {
    try {
      await API.post(`/issues/${issueId}/upvote`);
      fetchIssues();
    } catch (error) {
      alert(error.response?.data?.message || "Upvote failed");
    }
  };

  const stats = [
    { icon: MapPin, label: "Active Issues", value: issues.filter(i => i.status === "OPEN").length },
    { icon: Users, label: "Community Members", value: "1.2K+" },
    { icon: CheckCircle, label: "Issues Resolved", value: issues.filter(i => i.status === "RESOLVED").length },
    { icon: TrendingUp, label: "This Month", value: "+23%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Solve Civic Issues
              <br />
              <span className="text-blue-200">Together</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
            >
              Report, track, and resolve community problems with your neighbors.
              Make your city better, one issue at a time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => navigate("/create")}
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
              >
                <Plus className="mr-2 h-5 w-5" />
                Report an Issue
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/map")}
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
              >
                <MapPin className="mr-2 h-5 w-5" />
                View Map
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
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
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="transition-all duration-200"
                >
                  {status === "ALL" ? "All Issues" : status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Issues Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : filteredIssues.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No issues found" : "No issues yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Be the first to report an issue in your community and help make it better."
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate("/create")} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Report First Issue
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <IssueCard issue={issue} onUpvote={handleUpvote} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;