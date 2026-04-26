import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Home from "./pages/Home";
import IssueDetail from "./pages/IssueDetail";
import CreateIssue from "./pages/CreateIssue";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import MapView from "./pages/MapView";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

// Component to protect private routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Component to handle root route based on auth status
const AuthWrapper = () => {
  const token = localStorage.getItem("token");
  return token ? <Home /> : <Navigate to="/login" replace />;
};

// Component to redirect authenticated users away from auth pages
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      {/* ✅ Navbar on top */}
      <Navbar />

      <Routes>
        <Route path="/" element={<AuthWrapper />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
        <Route path="/issue/:id" element={<IssueDetail />} />
        <Route path="/create" element={<ProtectedRoute><CreateIssue /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;