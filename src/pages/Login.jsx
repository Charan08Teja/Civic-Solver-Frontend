import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful");

      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      if (message === "Please verify your email first") {
        setErrorMessage("Please verify your email before logging in.");
      } else {
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-10 dark:bg-slate-950">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-600">Login to manage your issues and notifications.</p>
        </div>

        {infoMessage && (
          <div className="mb-4 rounded-2xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
            {infoMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white text-sm font-semibold shadow-sm transition hover:bg-blue-700"
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;