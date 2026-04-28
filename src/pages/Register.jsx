import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP verification state
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // UI state
  const [step, setStep] = useState("register"); // "register" or "verify"
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful. Please verify your email.");
      setTimeout(() => {
        setStep("verify");
        setSuccess("");
      }, 500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      console.log(error.response);

      // Handle case where email is already registered
      if (errorMessage.includes("already registered") || errorMessage.includes("already exists")) {
        setError("Email already registered. Please verify OTP to continue.");
        setTimeout(() => {
          setStep("verify");
          setError("");
        }, 500);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || otp.length !== 6) {
      setError("Please provide a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/verify-otp", { email, otp });
      setSuccess("Email verified successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { message: "Email verified successfully. You may now log in." },
        });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email not found. Please go back and register again.");
      return;
    }

    try {
      setResendLoading(true);
      await API.post("/auth/resend-otp", { email });
      setSuccess("OTP resent successfully. Check your email.");
      setCountdown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleBackToRegister = () => {
    setStep("register");
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-10 dark:bg-slate-950">
      {step === "register" ? (
        // ===== REGISTRATION FORM =====
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-sm text-gray-600">Join Civic Solver to report issues and track progress.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a secure password"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-green-600 px-4 py-3 text-white text-sm font-semibold shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-green-600 hover:text-green-800 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      ) : (
        // ===== OTP VERIFICATION FORM =====
        <form
          onSubmit={handleVerifyOtp}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h2>
            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to <span className="font-medium text-gray-900">{email || "your email"}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-2xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="123456"
                maxLength={6}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl tracking-[0.3em] text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white text-sm font-semibold shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="mb-2">Didn’t receive the code?</p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || countdown > 0}
              className="font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:hover:text-gray-400"
            >
              {resendLoading ? "Resending..." : countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Register;