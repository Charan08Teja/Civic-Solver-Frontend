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
    <div className="h-screen flex items-center justify-center bg-blue-50">
      {step === "register" ? (
        // ===== REGISTRATION FORM =====
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded-xl shadow-md w-80"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 mb-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 hover:text-green-800 hover:underline font-medium transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>
      ) : (
        // ===== OTP VERIFICATION FORM =====
        <form
          onSubmit={handleVerifyOtp}
          className="bg-white p-6 rounded-xl shadow-md w-80"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Verify Email</h2>
          <p className="text-center text-gray-600 text-sm mb-4">
            Enter the 6-digit code sent to {email}
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 mb-4 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
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
              className="w-full p-2 mb-4 border rounded text-center text-2xl tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 mb-3"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center text-sm text-gray-600 mb-4">
            <p className="mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading || countdown > 0}
              className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 font-medium transition-colors duration-200"
            >
              {resendLoading ? "Resending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleBackToRegister}
            className="w-full text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
          >
            Back to Registration
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;