import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Button from "./Button";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get("/issues/me");
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <h1
            className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/")}
          >
            Civic Solver
          </h1>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/map" className="hover:text-blue-600">Map</Link>
            <Link to="/notifications" className="hover:text-blue-600">Notifications</Link>

            {token && (
              <>
                <Link to="/profile" className="hover:text-blue-600">Profile</Link>

                {/* ✅ FIXED ADMIN CHECK */}
                {user?.role === "ADMIN" && (
                  <>
                    <Link
                      to="/admin"
                      className="text-red-600 font-semibold hover:text-red-800"
                    >
                      Admin
                    </Link>
                    <Link
                      to="/dashboard"
                      className="text-purple-600 font-semibold hover:text-purple-800"
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {token && (
              <Button size="sm" onClick={() => navigate("/create")}>
                Report Issue
              </Button>
            )}

            {token ? (
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;