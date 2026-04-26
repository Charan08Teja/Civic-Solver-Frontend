import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    // Sync email from router state if available
    if (location.state?.email && !email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || otp.length !== 6) {
      setError("Please provide your email and a 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/verify-otp", { email, otp });
      setSuccess("OTP verified successfully. Redirecting to login...");
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

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email to resend OTP.");
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

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">Verify Your Email</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code we sent to your email to complete registration.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-xl tracking-[0.3em] text-center text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white text-sm font-semibold shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-2">Didn’t receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || countdown > 0}
            className="font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:hover:text-gray-400"
          >
            {resendLoading ? "Resending..." : countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
