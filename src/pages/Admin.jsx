import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import API from "../api/axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import CategoryBadge from "../components/CategoryBadge";

function Admin() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await API.get("/issues/me");

        if (res.data.role !== "ADMIN") {
          navigate("/");
          return;
        }

        setUser(res.data);
      } catch (error) {
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/issues/issues");
      setIssues(res.data.issues);
      setFilteredIssues(res.data.issues);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  useEffect(() => {
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (categoryFilter !== "ALL") {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, categoryFilter]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/issues/issues/${id}/status`, { status });
      fetchIssues();
    } catch (error) {
      console.log(error.response);
      alert(error.response?.data?.message || "Failed to update");
    }
  };

  const deleteIssue = async (id) => {
    if (window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      try {
        await API.delete(`/issues/issues/${id}`);
        fetchIssues();
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  // Calculate stats
  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === "OPEN").length,
    inProgress: issues.filter(i => i.status === "IN_PROGRESS").length,
    resolved: issues.filter(i => i.status === "RESOLVED").length,
    totalUpvotes: issues.reduce((sum, issue) => sum + (issue._count?.upvotes || 0), 0),
  };

  // Chart data
  const statusData = [
    { name: "Open", value: stats.open, color: "#f59e0b" },
    { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { name: "Resolved", value: stats.resolved, color: "#10b981" },
  ];

  const categoryData = issues.reduce((acc, issue) => {
    const category = issue.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

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

  const categories = [...new Set(issues.map(issue => issue.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor community issues</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: AlertCircle, label: "Total Issues", value: stats.total, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
            { icon: Clock, label: "Open Issues", value: stats.open, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/20" },
            { icon: TrendingUp, label: "In Progress", value: stats.inProgress, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
            { icon: CheckCircle, label: "Resolved", value: stats.resolved, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/20" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
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

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Status Distribution */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Issue Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Issues by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredIssues.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {issues.length === 0 ? "No issues to manage" : "No issues match your filters"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {issues.length === 0
                    ? "All issues have been resolved or there are no reported issues yet."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                onClick={() => window.location.href = `/issue/${issue.id}`}>
                              {issue.title}
                            </h2>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.location.href = `/issue/${issue.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(issue.id, "IN_PROGRESS")}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteIssue(issue.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Issue
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {issue.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{issue.user?.name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{issue._count?.upvotes || 0} upvotes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge className={`${statusColors[issue.status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}>
                              {statusLabels[issue.status] || "Open"}
                            </Badge>
                            {issue.category && <CategoryBadge category={issue.category} />}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:min-w-48">
                          <Button
                            size="sm"
                            variant={issue.status === "IN_PROGRESS" ? "default" : "outline"}
                            onClick={() => updateStatus(issue.id, "IN_PROGRESS")}
                            disabled={issue.status === "IN_PROGRESS"}
                            className="w-full"
                          >
                            Mark In Progress
                          </Button>
                          <Button
                            size="sm"
                            variant={issue.status === "RESOLVED" ? "default" : "outline"}
                            onClick={() => updateStatus(issue.id, "RESOLVED")}
                            disabled={issue.status === "RESOLVED"}
                            className="w-full"
                          >
                            Mark Resolved
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteIssue(issue.id)}
                            className="w-full"
                          >
                            Delete Issue
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Admin;