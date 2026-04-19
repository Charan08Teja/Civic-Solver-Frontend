import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Civic Solver
      </h1>

      {/* Links */}
      <div className="flex gap-4 items-center">
        <Link to="/">🏠 Home</Link>
        <Link to="/create">➕ Create</Link>
        <Link to="/notifications">🔔</Link>

        {/* ✅ Show Admin only if logged in */}
        {token && (
          <Link to="/admin">🛠 Admin</Link>
        )}

        {/* Auth */}
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;